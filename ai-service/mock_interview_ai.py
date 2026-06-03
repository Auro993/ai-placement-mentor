from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import speech_recognition as sr
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'YOUR_API_KEY_HERE')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Store interview sessions
interview_sessions = {}

@app.route('/api/interview/analyze', methods=['POST'])
def analyze_answer():
    try:
        data = request.json
        question = data.get('question', '')
        answer = data.get('answer', '')
        role = data.get('role', 'Software Engineer')
        
        # Create prompt for Gemini
        prompt = f"""
        You are an expert technical interviewer for {role} positions.
        
        INTERVIEW QUESTION: {question}
        
        CANDIDATE'S ANSWER: {answer}
        
        Analyze this answer and provide feedback in the following JSON format:
        {{
            "score": (0-100 integer),
            "feedback": "Detailed feedback on what was good and what needs improvement",
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"],
            "star_method_used": (true/false),
            "keywords_found": ["keyword1", "keyword2"],
            "suggested_answer": "A brief suggested way to answer this question"
        }}
        
        Consider:
        - Clarity and structure of answer
        - Use of STAR method (Situation, Task, Action, Result)
        - Specific examples and metrics
        - Relevance to {role} role
        - Confidence and professionalism
        """
        
        response = model.generate_content(prompt)
        
        # Parse JSON from response
        import json
        import re
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            analysis = json.loads(json_match.group())
        else:
            analysis = {
                "score": 70,
                "feedback": "Your answer was good. Try to add more specific examples and use the STAR method.",
                "strengths": ["Clear communication"],
                "improvements": ["Add metrics", "Use STAR method"],
                "star_method_used": False,
                "keywords_found": [],
                "suggested_answer": "I would structure my answer using the STAR method..."
            }
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({
            "score": 60,
            "feedback": f"AI analysis error: {str(e)}. Here's some general advice: Use the STAR method and provide specific examples.",
            "strengths": ["Attempted to answer"],
            "improvements": ["Use more structure", "Add specific examples"],
            "star_method_used": False,
            "keywords_found": [],
            "suggested_answer": "Start by describing the Situation, then the Task, Action you took, and finally the Result."
        })

@app.route('/api/interview/generate-question', methods=['POST'])
def generate_question():
    try:
        data = request.json
        role = data.get('role', 'Software Engineer')
        difficulty = data.get('difficulty', 'medium')
        previous_questions = data.get('previous_questions', [])
        
        prompt = f"""
        Generate a unique {difficulty} difficulty interview question for a {role} position.
        Previous questions asked: {previous_questions}
        
        Return JSON format:
        {{
            "question": "The interview question",
            "category": "Technical/Behavioral/Problem Solving",
            "expected_keywords": ["keyword1", "keyword2"],
            "tip": "Brief tip on how to answer this question well"
        }}
        """
        
        response = model.generate_content(prompt)
        
        import json
        import re
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            question_data = json.loads(json_match.group())
        else:
            question_data = {
                "question": "Tell me about a challenging project you worked on and how you overcame obstacles.",
                "category": "Behavioral",
                "expected_keywords": ["challenge", "solution", "team", "result"],
                "tip": "Use the STAR method to structure your answer"
            }
        
        return jsonify(question_data)
        
    except Exception as e:
        return jsonify({
            "question": "Tell me about yourself and why you're interested in this role.",
            "category": "Behavioral",
            "expected_keywords": ["experience", "skills", "passion", "growth"],
            "tip": "Keep it concise, focus on relevant experience"
        })

@app.route('/api/interview/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        audio_file = request.files['audio']
        
        recognizer = sr.Recognizer()
        
        # Convert audio to text
        with sr.AudioFile(io.BytesIO(audio_file.read())) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)  # Free API, works well
            
        return jsonify({'text': text, 'success': True})
        
    except sr.UnknownValueError:
        return jsonify({'text': '', 'error': 'Could not understand audio. Please speak clearly.'})
    except sr.RequestError as e:
        return jsonify({'text': '', 'error': f'Speech service error: {e}'})
    except Exception as e:
        return jsonify({'text': '', 'error': str(e)})

if __name__ == '__main__':
    app.run(port=5001, debug=True)