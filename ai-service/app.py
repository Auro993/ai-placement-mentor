from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import re
import random
import os
from dotenv import load_dotenv

# =====================================================
# LOAD ENV VARIABLES
# =====================================================
load_dotenv()

# =====================================================
# FLASK APP
# =====================================================
app = Flask(__name__)
CORS(app)

# =====================================================
# GET API KEY FROM ENVIRONMENT VARIABLE
# =====================================================
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file")
    exit(1)

# Initialize Gemini API
genai.configure(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

print("✅ Gemini API Client Initialized Successfully!")
print(f"🤖 Active Target Model: {MODEL_NAME}")
print("🚀 JobGenie AI Service running at http://localhost:5001")

# =====================================================
# FALLBACK DATA STORE
# =====================================================
FALLBACK_QUESTIONS = {
    "Frontend Developer": [
        {"question": "How would you optimize a React application rendering slowly?", "category": "Performance", "tip": "Discuss lazy loading, memoization, virtualization."},
        {"question": "Explain useEffect lifecycle in React.", "category": "React", "tip": "Discuss dependency array and cleanup."}
    ],
    "Backend Developer": [
        {"question": "How would you implement rate limiting in APIs?", "category": "System Design", "tip": "Discuss token bucket and Redis."},
        {"question": "Difference between SQL and NoSQL?", "category": "Database", "tip": "Discuss schema and scalability."}
    ],
    "Software Engineer": [
        {"question": "Design a URL shortener like bit.ly.", "category": "System Design", "tip": "Discuss hashing and scalability."},
        {"question": "Explain CAP theorem.", "category": "Distributed Systems", "tip": "Discuss consistency and availability tradeoffs."}
    ],
    "Full Stack Developer": [
        {"question": "How would you implement JWT authentication in MERN?", "category": "Authentication", "tip": "Discuss tokens and protected routes."},
        {"question": "What is CORS and how do you solve it?", "category": "Web Security", "tip": "Discuss headers and origin policies."}
    ]
}

# =====================================================
# COMPLETE PLACEMENT KEYWORDS DATABASE
# =====================================================
PLACEMENT_KEYWORDS = [
    "placement", "placements", "campus placement", "off-campus", "placement drive",
    "recruitment", "hiring", "selection process", "placement process",
    "placement cell", "training and placement", "tpo",
    "job", "jobs", "internship", "internships", "full-time", "part-time",
    "work from home", "wfh", "remote job", "on-site", "hybrid",
    "offer", "offers", "package", "ctc", "lpa", "salary", "stipend",
    "interview", "interviews", "mock interview", "mock interviews",
    "technical interview", "hr interview", "behavioral interview",
    "system design interview", "coding interview", "telephonic interview",
    "video interview", "face to face interview", "panel interview",
    "interview tips", "interview questions", "interview preparation",
    "interview experience", "interview feedback",
    "aptitude round", "aptitude test", "online test", "coding round",
    "technical round", "hr round", "managerial round", "group discussion",
    "gd", "written test", "psychometric test", "communication test",
    "resume", "cv", "curriculum vitae", "cover letter", "cover letters",
    "ats", "ats resume", "resume format", "resume template", "resume tips",
    "resume review", "resume builder", "resume writing", "resume optimization",
    "google", "amazon", "microsoft", "meta", "facebook", "apple", "netflix",
    "uber", "flipkart", "adobe", "oracle", "salesforce", "nvidia", "intel",
    "cisco", "vmware", "paypal", "stripe", "twitter", "linkedin", "snapchat",
    "tcs", "infosys", "wipro", "accenture", "capgemini", "cognizant",
    "hcl", "tech mahindra", "lti", "mindtree", "mphasis", "hexaware",
    "dell", "hp", "ibm", "hpe", "nokia", "ericsson", "samsung",
    "reliance", "tata", "adani", "mahindra", "ola", "oyo", "zomato", "swiggy",
    "paytm", "phonepe", "gpay", "cred", "razorpay", "zerodha", "upstox",
    "byjus", "unacademy", "upgrad", "great learning", "coursera",
    "java", "python", "c++", "c programming", "javascript", "typescript",
    "ruby", "php", "swift", "kotlin", "golang", "rust", "scala", "perl",
    "r language", "matlab", "sql", "pl/sql", "nosql",
    "react", "angular", "vue", "next.js", "gatsby", "nuxt",
    "html", "css", "sass", "tailwind", "bootstrap", "material ui",
    "node.js", "express", "django", "flask", "spring boot", "spring",
    "jsp", "servlet", "hibernate", "jpa", "rest api", "graphql",
    "web development", "frontend", "backend", "full stack", "fullstack",
    "sql", "mysql", "postgresql", "oracle database", "mongodb", "cassandra",
    "redis", "elasticsearch", "dynamodb", "firebase", "realm", "sqlite",
    "aws", "amazon web services", "azure", "google cloud", "gcp",
    "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
    "terraform", "ansible", "chef", "puppet", "linux", "unix",
    "devops", "sre", "site reliability", "cloud computing",
    "dsa", "data structures", "algorithms", "algorithm",
    "array", "arrays", "string", "strings", "linked list", "linked lists",
    "stack", "queue", "tree", "trees", "graph", "graphs",
    "dynamic programming", "dp", "recursion", "backtracking",
    "greedy", "greedy algorithm", "sorting", "searching", "hashing",
    "heap", "trie", "bit manipulation", "sliding window", "two pointer",
    "divide and conquer", "binary search", "dfs", "bfs", "binary tree",
    "bst", "avl tree", "red black tree", "segment tree", "fenwick tree",
    "system design", "high level design", "hld", "low level design", "lld",
    "microservices", "api design", "database design", "schema design",
    "caching", "redis cache", "cdn", "load balancer", "scalability",
    "availability", "consistency", "cap theorem", "eventual consistency",
    "message queue", "kafka", "rabbitmq", "pub sub", "distributed systems",
    "object oriented design", "ood", "design patterns", "solid principles",
    "communication", "communication skills", "leadership", "teamwork",
    "problem solving", "critical thinking", "time management",
    "presentation skills", "negotiation skills", "conflict resolution",
    "emotional intelligence", "adaptability", "creativity",
    "interpersonal skills", "professionalism", "work ethic",
    "aptitude", "quantitative aptitude", "quant", "math", "mathematics",
    "logical reasoning", "verbal ability", "english", "grammar",
    "reading comprehension", "rc", "data interpretation", "di",
    "blood relations", "puzzle", "syllogism", "coding decoding",
    "roadmap", "roadmaps", "study plan", "preparation strategy",
    "resources", "books", "youtube channels", "courses", "certifications",
    "leetcode", "codeforces", "codechef", "hackerrank", "hackerearth",
    "geeksforgeeks", "gfg", "interviewbit", "coding ninjas",
    "projects", "project ideas", "portfolio", "github", "git",
    "open source", "oss", "contributions", "side projects",
    "personal projects", "college projects", "capstone project",
    "hr", "human resources", "behavioral", "star method",
    "tell me about yourself", "strength", "weakness",
    "salary negotiation", "counter offer", "offer negotiation",
    "why should we hire you", "why this company",
    "where do you see yourself", "career goals", "career aspirations",
    "linkedin", "networking", "referral", "alumni", "alumni network",
    "professional network", "connection", "follow-up", "thank you email",
    "how to", "how do", "how can", "ways to", "tips for", "guide to",
    "best way", "step by step", "beginner", "advanced",
    "from scratch", "zero", "start", "starting", "begin",
    "prepare", "preparation", "study", "learn", "practice",
    "improve", "master", "crack", "ace", "achieve",
    "important", "required", "necessary", "needed", "essential",
    "worth", "value", "benefit", "advantage", "disadvantage",
    "career", "career guidance", "career options", "career path",
    "fresher", "experienced", "college", "university", "degree",
    "btech", "b.e", "mtech", "mca", "bca", "bsc", "msc",
    "final year", "pre-final", "placement season", "campus drive",
    "selection ratio", "cutoff", "eligibility", "criteria",
    "bond", "service agreement", "joining date", "onboarding",
]

# =====================================================
# GREETINGS LIST
# =====================================================
GREETINGS = [
    "hi", "hello", "hey", "hi there", "hello there", "greetings",
    "good morning", "good evening", "good afternoon", "good night",
    "hii", "heyy", "hey there", "yo", "sup", "what's up", "howdy",
    "namaste", "hola", "bonjour", "hello ji", "hi ji"
]

# =====================================================
# HELPERS
# =====================================================
def is_placement_related(message):
    """Check if the message is related to placements"""
    message_lower = message.lower()
    
    for keyword in PLACEMENT_KEYWORDS:
        if keyword in message_lower:
            return True
    
    placement_patterns = [
        "how to prepare", "how do i prepare", "how i prepare",
        "how to start", "how do i start", "how i start",
        "from zero", "from scratch", "beginner",
        "tips for", "guide to", "roadmap for",
        "important", "required", "needed for", "worth it",
        "what is", "explain", "tell me about", "give me",
        "suggest", "recommend", "advice", "help with"
    ]
    
    for pattern in placement_patterns:
        if pattern in message_lower:
            related_terms = [
                "dsa", "coding", "interview", "placement", "job", "career",
                "programming", "tech", "software", "resume", "aptitude",
                "company", "package", "salary", "internship", "hiring"
            ]
            if any(term in message_lower for term in related_terms):
                return True
    
    return False

def is_greeting(message):
    """Check if the message is a greeting"""
    msg = message.lower().strip()
    return msg in GREETINGS or len(message.split()) <= 2 and msg in ["hi", "hello", "hey", "hii", "heyy"]

# =====================================================
# CORE ALGORITHMIC HELPERS
# =====================================================
def generate_intelligent_fallback(question, answer, role):
    answer_lower = answer.lower()
    answer_length = len(answer)
    score = 50

    if answer_length > 300:
        score += 20
    elif answer_length > 150:
        score += 15
    elif answer_length > 80:
        score += 10
    elif answer_length > 30:
        score += 5
    else:
        score -= 15

    action_verbs = ["developed", "implemented", "designed", "built", "created", "managed", "optimized", "deployed"]
    action_count = sum(1 for verb in action_verbs if verb in answer_lower)
    score += min(action_count * 2, 10)

    if re.search(r'\d+%|\d+\s*(users|requests|ms|seconds)', answer_lower):
        score += 10

    star_words = ["situation", "task", "action", "result", "challenge", "solution"]
    star_count = sum(1 for word in star_words if word in answer_lower)
    score += min(star_count * 3, 15)

    score = min(100, max(score, 0))

    if score >= 85:
        feedback = "Excellent answer with strong examples and structure."
    elif score >= 70:
        feedback = "Good answer. Add more metrics and technical depth."
    elif score >= 50:
        feedback = "Average answer. Use STAR method for clarity."
    else:
        feedback = "Answer needs more detail and stronger examples."

    strengths = []
    if answer_length > 100: strengths.append("Good detailed explanation")
    if action_count >= 2: strengths.append("Strong action verbs used")
    if star_count >= 2: strengths.append("Good STAR method structure")

    improvements = []
    if answer_length < 100: improvements.append("Add more detailed explanation")
    if action_count < 2: improvements.append("Use action verbs like Developed, Built, Implemented")
    if star_count < 2: improvements.append("Use STAR method structure")

    return {
        "score": score,
        "feedback": feedback,
        "strengths": strengths[:3],
        "improvements": improvements[:3],
        "star_method_used": star_count >= 2,
        "keywords_found": [],
        "suggested_answer": "Use the STAR method with measurable results and examples."
    }

# =====================================================
# ROUTING CONTROLLERS
# =====================================================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "success", "message": "JobGenie AI Service Active"})

# =====================================================
# CHAT ENDPOINT - WITH MEMORY/CONTEXT
# =====================================================
@app.route("/api/chat/send", methods=["POST"])
def chat():
    try:
        data = request.json
        message = data.get("message", "")
        history = data.get("history", [])

        if not message:
            return jsonify({"error": "Message is required"}), 400

        print(f"📩 User Message: {message}")
        print(f"📚 History length: {len(history)}")

        # Build conversation context
        context = ""
        if history and len(history) > 0:
            context = "Previous conversation:\n"
            for msg in history[-10:]:  # Last 10 messages for context
                role = "User" if msg.get('role') == 'user' else "Assistant"
                content = msg.get('content', '')
                context += f"{role}: {content}\n"
            context += f"\nUser's new question: {message}\n\n"

        # Check if it's a greeting
        if is_greeting(message) and len(history) <= 1:
            prompt = f"You are JobGenie AI Placement Mentor. Respond to: '{message}' Keep it short (1-2 sentences). Be friendly and ask how you can help with their placement journey."
            print("👋 Greeting detected")
        
        # Check if it's placement-related
        elif is_placement_related(message) or len(history) > 0:
            prompt = f"""You are JobGenie AI Placement Mentor. 

{context if context else f"Student Question: {message}"}

RULES:
- Keep response SHORT (max 5-6 sentences)
- Use bullet points if listing multiple items
- Be direct, practical, and helpful
- Provide actionable placement advice
- Remember previous conversation context
- If the user asked something before, build on that
- DO NOT write long paragraphs

Response:"""
            print("📚 Placement-related question detected")
        
        else:
            return jsonify({"reply": "I'm your Placement Mentor 👨‍🏫 I can only help with placement preparation, resumes, interviews, aptitude, DSA, company preparation, and career guidance. Please ask me something placement-related! 🎯"})

        print("🚀 Requesting Chat Output...")
        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        print("❌ Chat Error:", e)
        return jsonify({"reply": "Hi! I'm your Placement Mentor. How can I help you with your placement preparation today?"})

# =====================================================
# OTHER ENDPOINTS
# =====================================================
@app.route("/api/interview/generate-question", methods=["POST"])
def generate_question():
    try:
        data = request.json or {}
        role = data.get("role", "Software Engineer")
        difficulty = data.get("difficulty", "medium")
        prompt = f"Generate ONE unique {difficulty} interview question for a {role} role. Avoid generic questions, make it practical and technical."

        print("🚀 Routing Question Generation Engine...")
        
        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        
        # Try to parse JSON from response
        try:
            return jsonify(json.loads(response.text))
        except:
            # If not JSON, return as text
            return jsonify({"question": response.text, "category": "General", "tip": "No tip available"})
            
    except Exception as e:
        print(f"❌ AI Generation Error ({e}). Reverting to safe local dataset.")
        fallback = FALLBACK_QUESTIONS.get(role, FALLBACK_QUESTIONS["Software Engineer"])
        return jsonify(random.choice(fallback))

@app.route("/api/interview/analyze", methods=["POST"])
def analyze_answer():
    try:
        data = request.json or {}
        question = data.get("question", "")
        answer = data.get("answer", "")
        role = data.get("role", "Software Engineer")

        if not answer:
            return jsonify({"error": "Answer content required"}), 400

        prompt = f"""You are an expert interviewer.
Question:
{question}

Candidate Answer:
{answer}

Analyze the answer honestly. Return JSON with score (0-100), feedback, strengths, improvements, star_method_used, keywords_found, and suggested_answer."""
        
        print("🚀 Routing Metric Analysis...")
        
        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        
        try:
            # Try to parse as JSON
            result = json.loads(response.text)
            return jsonify(result)
        except:
            # Fallback to intelligent scoring
            fallback = generate_intelligent_fallback(question, answer, role)
            return jsonify(fallback)
        
    except Exception as e:
        print(f"❌ AI Analysis Error ({e}). Launching local fallback calculation.")
        fallback = generate_intelligent_fallback(question, answer, role)
        return jsonify(fallback)

@app.route("/api/roadmap/generate", methods=["POST"])
def generate_roadmap():
    try:
        data = request.json
        answers = data.get("answers", {})
        
        role = answers.get("1", "Software Engineer")
        experience = answers.get("2", "Fresher")
        dsa_level = answers.get("3", "Basic")
        hours = answers.get("8", "3-4 hrs")
        timeline = answers.get("9", "3 months")
        weak_area = answers.get("12", "DSA")
        learning_style = answers.get("10", "Mixed")
        
        prompt = f"""You are an expert career coach. Create a personalized {timeline} placement roadmap for a {role} candidate.

User Profile:
- Experience: {experience}
- DSA Level: {dsa_level}
- Hours available: {hours}/day
- Weak area: {weak_area}
- Learning style: {learning_style}

Generate a JSON response with this exact structure:
{{
    "weeks": [
        {{
            "week": 1,
            "title": "Week title",
            "tasks": [
                {{"title": "Task name", "description": "What to do", "hours": 2}}
            ],
            "totalHours": 10
        }}
    ],
    "resources": [
        {{"topic": "Topic name", "resources": [{{"type": "YouTube", "title": "Video title", "url": "https://...", "description": "Why watch"}}]}}
    ],
    "skillAnalysis": [
        {{"skill": "DSA", "percentage": 65, "status": "Needs improvement"}}
    ]
}}

Make it practical, actionable, and personalized to {role}. Use real YouTube links from channels like NeetCode, takeUforward, Gaurav Sen, FreeCodeCamp."""

        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        roadmap_data = json.loads(response.text)
        return jsonify(roadmap_data)
        
    except Exception as e:
        print(f"❌ Roadmap AI Error: {e}")
        fallback_roadmap = {
            "weeks": [
                {"week": 1, "title": "DSA Fundamentals", "tasks": [
                    {"title": "Arrays & Strings", "description": "Learn basic operations", "hours": 2},
                    {"title": "Hashing & Maps", "description": "HashMap, HashSet", "hours": 2}
                ], "totalHours": 10},
                {"week": 2, "title": "Advanced DSA", "tasks": [
                    {"title": "Trees & Graphs", "description": "Tree traversal, BFS, DFS", "hours": 3},
                    {"title": "Dynamic Programming", "description": "DP patterns", "hours": 3}
                ], "totalHours": 12}
            ],
            "resources": [
                {"topic": "DSA", "resources": [
                    {"type": "YouTube", "title": "NeetCode DSA Course", "url": "https://youtube.com/neetcode", "description": "Best DSA playlist"},
                    {"type": "YouTube", "title": "takeUforward", "url": "https://youtube.com/c/takeUforward", "description": "Striver's DSA sheet"}
                ]}
            ],
            "skillAnalysis": [
                {"skill": "DSA", "percentage": 60, "status": "Needs improvement"},
                {"skill": "System Design", "percentage": 40, "status": "Focus area"}
            ]
        }
        return jsonify(fallback_roadmap)

@app.route("/api/cover-letter/generate", methods=["POST"])
def generate_cover_letter():
    try:
        data = request.json
        user_name = data.get('userName', 'Candidate')
        company_name = data.get('companyName', '')
        job_title = data.get('jobTitle', '')
        skills = data.get('skills', '')
        experience = data.get('experience', '')
        achievements = data.get('achievements', '')
        tone = data.get('tone', 'professional')
        
        if not company_name or not job_title:
            return jsonify({"error": "Company name and job title are required"}), 400
        
        prompt = f"""Write a {tone} cover letter for:

Name: {user_name}
Position: {job_title}
Company: {company_name}
Skills: {skills if skills else 'Not specified'}
Experience: {experience if experience else 'Not specified'}
Key Achievements: {achievements if achievements else 'Not specified'}

Requirements:
- Write a professional, {tone} cover letter
- Highlight relevant skills and achievements
- Show enthusiasm for {company_name}
- Keep it concise but impactful
- Include placeholders for date and signature
- Format it as a proper business letter."""
        
        print(f"📝 Generating {tone} cover letter for {job_title} at {company_name}")
        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        return jsonify({"coverLetter": response.text})
        
    except Exception as e:
        print(f"❌ Cover Letter Error: {e}")
        fallback_letter = f"""Date

Hiring Manager
{data.get('companyName', '[Company Name]')}

Subject: Application for {data.get('jobTitle', '[Position]')} position

Dear Hiring Manager,

I am writing to express my strong interest in the {data.get('jobTitle', '[Position]')} position at {data.get('companyName', '[Company Name]')}.

{data.get('skills', 'With my relevant skills and experience')}, I am confident that I would be a valuable addition to your team.

I look forward to the opportunity to discuss how my skills align with your company's goals.

Sincerely,
{data.get('userName', 'Your Name')}"""
        return jsonify({"coverLetter": fallback_letter})

@app.route("/api/linkedin/generate-post", methods=["POST"])
def generate_linkedin_post():
    try:
        data = request.json
        topic = data.get('topic', '')
        post_type = data.get('postType', 'achievement')
        user_name = data.get('userName', 'Professional')
        
        prompt = f"""Write an engaging LinkedIn post about: {topic}

Post Type: {post_type}
Author: {user_name}

Requirements:
- Professional and engaging tone
- Use emojis appropriately
- Include relevant hashtags
- Keep under 300 words
- Add a question to encourage engagement
- Write in first person

Write the post directly without any explanation."""
        
        response = genai.generate_content(model=MODEL_NAME, contents=prompt)
        return jsonify({"post": response.text})
        
    except Exception as e:
        print(f"❌ LinkedIn Post Error: {e}")
        return jsonify({"post": f"Excited to share that {topic}! 🎉 What's your experience with this? #Growth #Learning"})

# =====================================================
# START RUNTIME
# =====================================================
if __name__ == "__main__":
    print("=" * 60)
    print("🤖 JobGenie Server Initializing Execution...")
    print("=" * 60)
    print("📝 Available Endpoints:")
    print("   - /api/chat/send (All Placement Topics with Memory)")
    print("   - /api/interview/generate-question")
    print("   - /api/interview/analyze")
    print("   - /api/roadmap/generate")
    print("   - /api/cover-letter/generate")
    print("   - /api/linkedin/generate-post")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5001, debug=True)