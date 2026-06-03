const AI_SERVICE_URL = 'http://localhost:5001';

export const aiService = {
  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Send chat message
  async sendChatMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      return data.reply || "I'm here to help!";
    } catch (error) {
      console.error('AI Service error:', error);
      return "I'm having trouble connecting. Please try again.";
    }
  },

  // Analyze interview answer
  async analyzeInterviewAnswer(question: string, answer: string, role: string): Promise<any> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/interview/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, role }),
      });
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        score: 60,
        feedback: "AI service unavailable. Using local analysis.",
        strengths: ["Answer provided"],
        improvements: ["Connect to AI for detailed analysis"],
        star_method_used: false,
        keywords_found: [],
        suggested_answer: "Try to structure your answer better."
      };
    }
  },

  // Generate interview question
  async generateInterviewQuestion(role: string): Promise<any> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/interview/generate-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty: 'medium' }),
      });
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        question: "Tell me about a challenging project you worked on.",
        category: "Behavioral",
        tip: "Use the STAR method to structure your answer"
      };
    }
  }
};