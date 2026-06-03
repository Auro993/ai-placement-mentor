package com.placement.demo.service;

import com.placement.demo.entity.Chat;
import com.placement.demo.entity.User;
import com.placement.demo.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

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

    // Mock AI response (will connect to Python AI service later)
    public String getAiResponse(String userMessage) {
        // Temporary mock responses
        String[] responses = {
            "Great question! Based on your skills, I recommend focusing on React and Spring Boot.",
            "For interviews, practice the STAR method: Situation, Task, Action, Result.",
            "Your resume should highlight quantifiable achievements.",
            "Consider building a portfolio project to showcase your skills."
        };
        return responses[(int) (Math.random() * responses.length)];
    }
}