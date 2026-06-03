package com.placement.demo.service;

import com.placement.demo.entity.Interview;
import com.placement.demo.entity.User;
import com.placement.demo.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    private final String[] questions = {
        "Tell me about yourself.",
        "Why do you want to work at our company?",
        "Describe a challenging project you worked on.",
        "What are your greatest strengths?",
        "Where do you see yourself in 5 years?",
        "How do you handle pressure and deadlines?",
        "Describe a time you failed and what you learned.",
        "Why should we hire you?"
    };

    public String getNextQuestion() {
        return questions[(int) (Math.random() * questions.length)];
    }

    public Interview saveInterview(User user, String question, String answer, String feedback, int score) {
        Interview interview = Interview.builder()
                .user(user)
                .question(question)
                .answer(answer)
                .feedback(feedback)
                .score(score)
                .build();

        return interviewRepository.save(interview);
    }

    // Legacy method for backward compatibility
    public Interview saveInterview(User user, String question, String answer) {
        String feedback = generateAIFeedback(answer, question);
        int score = calculateAIScore(answer);
        return saveInterview(user, question, answer, feedback, score);
    }

    public List<Interview> getUserInterviews(User user) {
        return interviewRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // AI-powered feedback generation
    public String generateAIFeedback(String answer, String question) {
        int length = answer.length();
        String lowerAnswer = answer.toLowerCase();
        
        // Check for STAR method keywords
        boolean hasSituation = lowerAnswer.contains("situation") || lowerAnswer.contains("was working") || lowerAnswer.contains("faced");
        boolean hasTask = lowerAnswer.contains("task") || lowerAnswer.contains("needed to") || lowerAnswer.contains("had to");
        boolean hasAction = lowerAnswer.contains("action") || lowerAnswer.contains("did") || lowerAnswer.contains("implemented");
        boolean hasResult = lowerAnswer.contains("result") || lowerAnswer.contains("outcome") || lowerAnswer.contains("achieved");
        
        boolean usedStarMethod = hasSituation && hasTask && hasAction && hasResult;
        
        // Check for metrics and numbers
        boolean hasMetrics = answer.matches(".*\\d+%.*") || answer.matches(".*\\d+\\s*(million|thousand|percent).*");
        
        // Check for action verbs
        String[] actionVerbs = {"developed", "led", "created", "designed", "implemented", "managed", "improved", "increased", "reduced"};
        boolean hasActionVerbs = false;
        for (String verb : actionVerbs) {
            if (lowerAnswer.contains(verb)) {
                hasActionVerbs = true;
                break;
            }
        }
        
        StringBuilder feedback = new StringBuilder();
        
        // Length-based feedback
        if (length < 50) {
            feedback.append("⚠️ Your answer is too short. ");
            feedback.append("Aim for 1-2 minutes of speaking time. ");
        } else if (length > 500) {
            feedback.append("⚠️ Your answer is quite long. ");
            feedback.append("Try to be more concise (1-2 minutes ideal). ");
        } else {
            feedback.append("✅ Good length for an interview answer. ");
        }
        
        // STAR Method feedback
        if (usedStarMethod) {
            feedback.append("✅ Excellent! You used the STAR method effectively. ");
        } else {
            feedback.append("💡 Tip: Use the STAR method - describe the Situation, Task, Action, and Result. ");
        }
        
        // Metrics feedback
        if (hasMetrics) {
            feedback.append("✅ Great job including quantifiable achievements! ");
        } else {
            feedback.append("📊 Tip: Add specific numbers and metrics (e.g., 'Improved performance by 30%'). ");
        }
        
        // Action verbs feedback
        if (hasActionVerbs) {
            feedback.append("✅ Strong action verbs detected! ");
        } else {
            feedback.append("💪 Tip: Use action verbs like 'Developed', 'Led', 'Implemented'. ");
        }
        
        // Question-specific feedback
        if (question.contains("yourself")) {
            if (lowerAnswer.contains("experience") && lowerAnswer.contains("skills")) {
                feedback.append("✅ Good self-introduction covering experience and skills. ");
            } else {
                feedback.append("💡 For 'Tell me about yourself', cover: past experience, current role, future goals. ");
            }
        }
        
        if (question.contains("strengths")) {
            if (lowerAnswer.contains("example")) {
                feedback.append("✅ Good job providing an example of your strength! ");
            } else {
                feedback.append("💡 When discussing strengths, always provide a concrete example. ");
            }
        }
        
        if (question.contains("company")) {
            if (lowerAnswer.contains("research") || lowerAnswer.contains("values") || lowerAnswer.contains("culture")) {
                feedback.append("✅ Shows you've researched the company! ");
            } else {
                feedback.append("💡 Mention specific things you like about the company (culture, products, values). ");
            }
        }
        
        return feedback.toString();
    }

    // AI-powered score calculation
    public int calculateAIScore(String answer) {
        int score = 50; // Base score
        int length = answer.length();
        String lowerAnswer = answer.toLowerCase();
        
        // Length scoring (20 points max)
        if (length > 200 && length < 500) {
            score += 20;
        } else if (length > 100) {
            score += 15;
        } else if (length > 50) {
            score += 10;
        } else if (length > 20) {
            score += 5;
        }
        
        // STAR method detection (15 points)
        boolean hasSituation = lowerAnswer.contains("situation") || lowerAnswer.contains("was working") || lowerAnswer.contains("faced");
        boolean hasTask = lowerAnswer.contains("task") || lowerAnswer.contains("needed to") || lowerAnswer.contains("had to");
        boolean hasAction = lowerAnswer.contains("action") || lowerAnswer.contains("did") || lowerAnswer.contains("implemented") || lowerAnswer.contains("developed");
        boolean hasResult = lowerAnswer.contains("result") || lowerAnswer.contains("outcome") || lowerAnswer.contains("achieved") || lowerAnswer.matches(".*\\d+%.*");
        
        int starPoints = 0;
        if (hasSituation) starPoints += 4;
        if (hasTask) starPoints += 4;
        if (hasAction) starPoints += 4;
        if (hasResult) starPoints += 3;
        score += starPoints;
        
        // Metrics detection (10 points)
        if (answer.matches(".*\\d+%.*")) score += 5;
        if (answer.matches(".*\\d+\\s*(million|thousand|lakh|crore).*")) score += 5;
        
        // Action verbs detection (10 points)
        String[] actionVerbs = {"developed", "led", "created", "designed", "implemented", "managed", "improved", "increased", "reduced", "achieved"};
        int verbCount = 0;
        for (String verb : actionVerbs) {
            if (lowerAnswer.contains(verb)) {
                verbCount++;
            }
        }
        score += Math.min(10, verbCount * 2);
        
        // Industry keywords detection (10 points)
        String[] keywords = {"project", "team", "customer", "client", "deadline", "delivered", "launched", "built"};
        int keywordCount = 0;
        for (String keyword : keywords) {
            if (lowerAnswer.contains(keyword)) {
                keywordCount++;
            }
        }
        score += Math.min(10, keywordCount);
        
        // Penalties
        if (length < 30) score -= 15;
        if (lowerAnswer.contains("um") || lowerAnswer.contains("like") || lowerAnswer.contains("you know")) {
            score -= 5;
        }
        
        return Math.min(100, Math.max(0, score));
    }
}