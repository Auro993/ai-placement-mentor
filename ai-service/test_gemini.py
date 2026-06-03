import google.generativeai as genai

# Your key
API_KEY = "AlzaSyAvVzB9b7MASJWF2W8fBvCCM1RhbyMV7XM"

try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello in one word")
    print("✅ SUCCESS! Key works!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")
    print("This key may not be valid for Google Gemini")