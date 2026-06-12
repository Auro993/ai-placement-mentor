package com.placement.demo.service;

import com.placement.demo.entity.Chat;
import com.placement.demo.entity.User;
import com.placement.demo.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;
    
    private final String AI_SERVICE_URL = "http://localhost:5001/api/chat/send";

    public Chat saveChat(User user, String userMessage, String aiResponse) {
        Chat chat = Chat.builder()
                .user(user)
                .userMessage(userMessage)
                .aiResponse(aiResponse)
                .build();
        return chatRepository.save(chat);
    }

    public List<Chat> getUserChats(User user) {
        return chatRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Get AI response from Python AI service
    public String getAiResponse(String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, String> request = new HashMap<>();
            request.put("message", userMessage);
            
            System.out.println("📤 Calling AI Service with message: " + userMessage);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_SERVICE_URL, 
                request, 
                Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("reply")) {
                String aiReply = (String) responseBody.get("reply");
                System.out.println("📥 AI Response received: " + aiReply);
                return aiReply;
            }
            return getFallbackResponse(userMessage);
            
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }
    
    // Fallback responses if AI service is down
    private String getFallbackResponse(String message) {
        String[] responses = {
            "Great question! For placement preparation, focus on DSA and system design fundamentals.",
            "I recommend practicing mock interviews regularly to build confidence.",
            "Make sure your resume highlights quantifiable achievements with numbers.",
            "Keep learning and stay consistent with your preparation! You've got this!",
            "Try to solve at least 2-3 DSA problems daily for better retention.",
            "Your question: '" + message + "' - This is important for placement preparation."
        };
        return responses[(int) (Math.random() * responses.length)];
    }
}