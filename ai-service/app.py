from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
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
# GET API KEY FROM ENVIRONMENT VARIABLE (NOT HARDCODED)
# =====================================================
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file")
    exit(1)

# Initialize modern client directly with your working key
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

print("✅ Gemini API Client Initialized Successfully!")
print(f"🤖 Active Target Model: {MODEL_NAME}")
print("🚀 JobGenie AI Service running at http://localhost:5001")

# =====================================================
# FALLBACK DATA STORE
# =====================================================
FALLBACK_QUESTIONS = {
    "Frontend Developer": [
        {
            "question": "How would you optimize a React application rendering slowly?",
            "category": "Performance",
            "tip": "Discuss lazy loading, memoization, virtualization."
        },
        {
            "question": "Explain useEffect lifecycle in React.",
            "category": "React",
            "tip": "Discuss dependency array and cleanup."
        }
    ],
    "Backend Developer": [
        {
            "question": "How would you implement rate limiting in APIs?",
            "category": "System Design",
            "tip": "Discuss token bucket and Redis."
        },
        {
            "question": "Difference between SQL and NoSQL?",
            "category": "Database",
            "tip": "Discuss schema and scalability."
        }
    ],
    "Software Engineer": [
        {
            "question": "Design a URL shortener like bit.ly.",
            "category": "System Design",
            "tip": "Discuss hashing and scalability."
        },
        {
            "question": "Explain CAP theorem.",
            "category": "Distributed Systems",
            "tip": "Discuss consistency and availability tradeoffs."
        }
    ],
    "Full Stack Developer": [
        {
            "question": "How would you implement JWT authentication in MERN?",
            "category": "Authentication",
            "tip": "Discuss tokens and protected routes."
        },
        {
            "question": "What is CORS and how do you solve it?",
            "category": "Web Security",
            "tip": "Discuss headers and origin policies."
        }
    ]
}

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
    return jsonify({
        "status": "success",
        "message": "JobGenie AI Service Active"
    })

@app.route("/api/chat/send", methods=["POST"])
def chat():
    try:
        data = request.json
        message = data.get("message", "")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        prompt = f"You are JobGenie AI Placement Mentor.\nStudent Question:\n{message}\n\nGive:\n- concise answer\n- placement guidance\n- interview advice\n- motivational tone"
        
        print("🚀 Requesting Chat Output...")
        response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        print("❌ Chat Error:", e)
        return jsonify({"reply": "The mentor service is refining system pipelines. Please resubmit shortly."})

@app.route("/api/interview/generate-question", methods=["POST"])
def generate_question():
    try:
        data = request.json or {}
        role = data.get("role", "Software Engineer")
        difficulty = data.get("difficulty", "medium")
        prompt = f"Generate ONE unique {difficulty} interview question for a {role} role. Avoid generic questions, make it practical and technical."

        print("🚀 Routing Question Generation Engine...")
        
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "question": types.Schema(type=types.Type.STRING),
                        "category": types.Schema(type=types.Type.STRING),
                        "tip": types.Schema(type=types.Type.STRING),
                    },
                    required=["question", "category", "tip"],
                ),
            ),
        )
        return jsonify(json.loads(response.text))
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

        prompt = f"You are an expert interviewer.\nQuestion:\n{question}\n\nCandidate Answer:\n{answer}\n\nAnalyze the answer honestly."
        
        print("🚀 Routing Metric Analysis...")
        
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "score": types.Schema(type=types.Type.INTEGER),
                        "feedback": types.Schema(type=types.Type.STRING),
                        "strengths": types.Schema(type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)),
                        "improvements": types.Schema(type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)),
                        "star_method_used": types.Schema(type=types.Type.BOOLEAN),
                        "keywords_found": types.Schema(type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)),
                        "suggested_answer": types.Schema(type=types.Type.STRING),
                    },
                    required=["score", "feedback", "strengths", "improvements", "star_method_used", "keywords_found", "suggested_answer"],
                ),
            ),
        )
        return jsonify(json.loads(response.text))
    except Exception as e:
        print(f"❌ AI Analysis Error ({e}). Launching local fallback calculation.")
        fallback = generate_intelligent_fallback(question, answer, role)
        return jsonify(fallback)

# =====================================================
# ROADMAP AI ENDPOINT
# =====================================================
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

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
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

# =====================================================
# COVER LETTER GENERATOR AI ENDPOINT
# =====================================================
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

Format it as a proper business letter."""
        
        print(f"📝 Generating {tone} cover letter for {job_title} at {company_name}")
        
        response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
        
        return jsonify({"coverLetter": response.text})
        
    except Exception as e:
        print(f"❌ Cover Letter Error: {e}")
        fallback_letter = f"""
{data.get('date', 'Date')}

Hiring Manager
{data.get('companyName', '[Company Name]')}

Subject: Application for {data.get('jobTitle', '[Position]')} position

Dear Hiring Manager,

I am writing to express my strong interest in the {data.get('jobTitle', '[Position]')} position at {data.get('companyName', '[Company Name]')}.

{data.get('skills', 'With my relevant skills and experience')}, I am confident that I would be a valuable addition to your team.

I look forward to the opportunity to discuss how my skills align with your company's goals.

Sincerely,
{data.get('userName', 'Your Name')}
"""
        return jsonify({"coverLetter": fallback_letter})

# =====================================================
# NEW: LINKEDIN POST GENERATOR ENDPOINT
# =====================================================
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
        
        response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
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
    print("   - /api/chat/send")
    print("   - /api/interview/generate-question")
    print("   - /api/interview/analyze")
    print("   - /api/roadmap/generate")
    print("   - /api/cover-letter/generate")
    print("   - /api/linkedin/generate-post (NEW)")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5001, debug=True)