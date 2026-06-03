import requests
import json

# Test 1: Health Check
print("=" * 50)
print("Testing Health Endpoint...")
print("=" * 50)
try:
    response = requests.get("http://localhost:5001/health")
    print(f"✅ Health Check: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test 2: Generate Interview Question
print("=" * 50)
print("Testing Generate Question...")
print("=" * 50)
try:
    body = {"role": "Software Engineer", "difficulty": "medium"}
    response = requests.post("http://localhost:5001/api/interview/generate-question", json=body)
    print(f"✅ Generated Question: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test 3: Analyze Answer
print("=" * 50)
print("Testing Analyze Answer...")
print("=" * 50)
try:
    body = {
        "question": "Tell me about yourself",
        "answer": "I am a computer science student with experience in React and Spring Boot. I have built several projects including an e-commerce website.",
        "role": "Software Engineer"
    }
    response = requests.post("http://localhost:5001/api/interview/analyze", json=body)
    data = response.json()
    print(f"✅ Score: {data.get('score')}")
    print(f"✅ Feedback: {data.get('feedback')[:100]}...")
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test 4: Chat
print("=" * 50)
print("Testing Chat...")
print("=" * 50)
try:
    body = {"message": "How to prepare for a technical interview?"}
    response = requests.post("http://localhost:5001/api/chat/send", json=body)
    print(f"✅ Chat Response: {response.json().get('reply')[:100]}...")
except Exception as e:
    print(f"❌ Error: {e}")