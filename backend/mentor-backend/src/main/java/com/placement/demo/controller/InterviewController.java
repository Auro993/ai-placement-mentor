package com.placement.demo.controller;

import com.placement.demo.entity.Interview;
import com.placement.demo.entity.User;
import com.placement.demo.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    private Long currentUserId = 1L;

    @GetMapping("/question")
    public ResponseEntity<?> getNextQuestion() {
        String question = interviewService.getNextQuestion();
        return ResponseEntity.ok(Map.of("question", question));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody AnswerRequest request) {
        try {
            User user = User.builder().id(currentUserId).build();
            
            // Generate AI-powered feedback based on answer content
            String feedback = interviewService.generateAIFeedback(request.getAnswer(), request.getQuestion());
            int score = interviewService.calculateAIScore(request.getAnswer());
            
            Interview interview = interviewService.saveInterview(user, request.getQuestion(), request.getAnswer(), feedback, score);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", interview.getId());
            response.put("feedback", interview.getFeedback());
            response.put("score", interview.getScore());
            response.put("question", interview.getQuestion());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getInterviewHistory() {
        try {
            User user = User.builder().id(currentUserId).build();
            List<Interview> interviews = interviewService.getUserInterviews(user);
            return ResponseEntity.ok(interviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    static class AnswerRequest {
        private String question;
        private String answer;
        
        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }
}