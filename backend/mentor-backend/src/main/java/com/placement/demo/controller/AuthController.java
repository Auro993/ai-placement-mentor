package com.placement.demo.controller;

import com.placement.demo.entity.User;
import com.placement.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("Received registration request: " + request);
            
            // Extract data from request
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            String skills = (String) request.get("skills");
            String careerGoal = (String) request.get("careerGoal");
            
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Skills: " + skills);
            System.out.println("Career Goal: " + careerGoal);
            
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User already exists with email: " + email));
            }
            
            // Create new user
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setSkills(skills);
            user.setCareerGoal(careerGoal);
            user.setRole("USER");
            
            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("email", savedUser.getEmail());
            response.put("name", savedUser.getName());
            response.put("skills", savedUser.getSkills() != null ? savedUser.getSkills().split(",") : new String[0]);
            response.put("careerGoal", savedUser.getCareerGoal());
            response.put("message", "Registration successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getName());
                response.put("skills", user.getSkills() != null ? user.getSkills().split(",") : new String[0]);
                response.put("careerGoal", user.getCareerGoal());
                response.put("message", "Login successful");
                
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }
}