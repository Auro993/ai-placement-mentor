# 🧞 JobGenie - AI Placement Mentor

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

> **AI-powered placement preparation platform** with resume optimization, mock interviews, personalized roadmaps, coding practice, and 24/7 career guidance—all in one place.

🔗 **Live Demo:** https://ai-placement-mentor-chi.vercel.app

---

# ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Mentor Chat** | 24/7 placement assistant powered by Google Gemini AI with context-aware conversations |
| 📄 **Resume Toolkit** | ATS scoring, AI resume correction, resume builder (5+ templates), LaTeX editor, and cover letter generator |
| 🎤 **Mock Interview** | AI-generated role-specific interview questions with instant feedback and STAR-based analysis |
| 🗺️ **Personalized Roadmaps** | AI-generated learning plans, company-specific preparation guides, and skill gap analysis |
| 💻 **Coding Practice** | Curated DSA questions, company-wise problem sets, and progress tracking |
| 📊 **Career Dashboard** | GitHub Insights, LinkedIn Studio, Portfolio Builder, and Progress Analytics |

---

# 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Framer Motion, Vite |
| **Backend** | Spring Boot, Java, JWT Authentication, MySQL |
| **AI Service** | Python Flask, Google Gemini AI, PostgreSQL |
| **Deployment** | Vercel, Render, Aiven |

---

# 🚀 Quick Start

## 1. Clone the Repository

```bash
git clone https://github.com/Auro993/ai-placement-mentor.git
cd ai-placement-mentor
```

## 2. Run Frontend

```bash
cd frontend/frontend-app
npm install
npm run dev
```

## 3. Run Backend

```bash
cd backend/mentor-backend
./mvnw.cmd spring-boot:run
```

> Windows users can use `mvnw.cmd` while Linux/macOS users can use `./mvnw`.

## 4. Run AI Service

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

---

# 🔑 Environment Variables

Create the required environment files and add the following variables.

```env
VITE_API_URL=http://localhost:8080/api
VITE_AI_SERVICE_URL=http://localhost:5001
GEMINI_API_KEY=your_google_gemini_api_key
```

---

# 📁 Project Structure

```text
ai-placement-mentor/
│
├── frontend/              # React + TypeScript + Tailwind CSS
│   └── frontend-app/
│
├── backend/               # Spring Boot + Java + MySQL
│   └── mentor-backend/
│
└── ai-service/            # Python Flask + Gemini AI
```

---

# 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://ai-placement-mentor-chi.vercel.app |
| **Backend** | https://app-backend-4qtj.onrender.com |
| **AI Service** | https://ai-service-zrrp.onrender.com |

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push to GitHub

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 📧 Contact

**Auroshikha Sahoo**

- GitHub: https://github.com/Auro993
- LinkedIn: https://www.linkedin.com/

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

<div align="center">

### Made with ❤️ by Aurosmita Sahoo

**Empowering students to crack placements with AI. 🚀**

</div>
