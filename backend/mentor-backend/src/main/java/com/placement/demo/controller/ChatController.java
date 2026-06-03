package com.placement.demo.controller;

import com.placement.demo.entity.Chat;
import com.placement.demo.entity.User;
import com.placement.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Temporary user ID (will be replaced with actual auth)
    private Long currentUserId = 1L;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {
        try {
            // Get user (temporary - will get from auth later)
            User user = User.builder().id(currentUserId).build();
            
            // Get AI response
            String aiResponse = chatService.getAiResponse(request.getMessage());
            
            // Save chat
            Chat chat = chatService.saveChat(user, request.getMessage(), aiResponse);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", chat.getId());
            response.put("userMessage", chat.getUserMessage());
            response.put("aiResponse", chat.getAiResponse());
            response.put("timestamp", chat.getCreatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory() {
        try {
            User user = User.builder().id(currentUserId).build();
            List<Chat> chats = chatService.getUserChats(user);
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