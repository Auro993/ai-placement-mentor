package com.placement.demo.controller;

import com.placement.demo.entity.Chat;
import com.placement.demo.entity.User;
import com.placement.demo.repository.ChatRepository;
import com.placement.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final String AI_SERVICE_URL = "http://localhost:5001/api/chat/send";

    // Temporary user ID (will be replaced with actual auth)
    private Long currentUserId = 1L;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {
        try {
            String userMessage = request.getMessage();
            System.out.println("📝 User message: " + userMessage);
            
            // Get AI response from Python service
            String aiResponse = getAiResponseFromService(userMessage);
            System.out.println("🤖 AI Response: " + aiResponse);
            
            // Get user
            User user = getUser();
            
            // Save chat to database
            Chat chat = Chat.builder()
                    .user(user)
                    .userMessage(userMessage)
                    .aiResponse(aiResponse)
                    .build();
            Chat savedChat = chatRepository.save(chat);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedChat.getId());
            response.put("userMessage", savedChat.getUserMessage());
            response.put("aiResponse", savedChat.getAiResponse());
            response.put("timestamp", savedChat.getCreatedAt());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    private String getAiResponseFromService(String message) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, String> request = new HashMap<>();
            request.put("message", message);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_SERVICE_URL, 
                request, 
                Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("reply")) {
                return (String) responseBody.get("reply");
            }
            return getFallbackResponse(message);
            
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            return getFallbackResponse(message);
        }
    }
    
    private String getFallbackResponse(String message) {
        // Fallback responses if AI service is down
        String[] fallbacks = {
            "Great question! For placement preparation, focus on DSA and system design fundamentals.",
            "I recommend practicing mock interviews regularly to build confidence.",
            "Make sure your resume highlights quantifiable achievements with numbers.",
            "Keep learning and stay consistent with your preparation! You've got this!",
            "Try to solve at least 2-3 DSA problems daily for better retention."
        };
        return fallbacks[(int) (Math.random() * fallbacks.length)];
    }
    
    private User getUser() {
        return userRepository.findById(currentUserId).orElse(null);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory() {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.ok(List.of());
            }
            List<Chat> chats = chatRepository.findByUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    static class ChatRequest {
        private String message;
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}