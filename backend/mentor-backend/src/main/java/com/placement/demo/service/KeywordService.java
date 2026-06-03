package com.placement.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class KeywordService {

    private final Map<String, List<String>> roleKeywords = new HashMap<>();
    
    public KeywordService() {
        // Software Engineer Keywords
        roleKeywords.put("Software Engineer", Arrays.asList(
            "Java", "Python", "JavaScript", "React", "Spring Boot", 
            "AWS", "Docker", "Git", "REST API", "Microservices",
            "SQL", "Agile", "JUnit", "Maven", "Hibernate", "Linux"
        ));
        
        // Data Scientist Keywords
        roleKeywords.put("Data Scientist", Arrays.asList(
            "Python", "SQL", "Machine Learning", "TensorFlow", "Pandas",
            "NumPy", "Statistics", "Data Visualization", "Scikit-learn",
            "Deep Learning", "R", "Tableau", "Hadoop", "Spark", "NLP"
        ));
        
        // Frontend Developer Keywords
        roleKeywords.put("Frontend Developer", Arrays.asList(
            "React", "JavaScript", "TypeScript", "HTML5", "CSS3",
            "Angular", "Vue.js", "Redux", "Webpack", "Tailwind",
            "Bootstrap", "Jest", "Responsive Design", "UI/UX", "Git"
        ));
        
        // Backend Developer Keywords
        roleKeywords.put("Backend Developer", Arrays.asList(
            "Java", "Spring Boot", "Python", "Node.js", "Express",
            "REST API", "Microservices", "SQL", "MongoDB", "Redis",
            "Docker", "Kubernetes", "AWS", "Git", "JWT", "Kafka"
        ));
        
        // Full Stack Developer Keywords
        roleKeywords.put("Full Stack Developer", Arrays.asList(
            "React", "Node.js", "Java", "Python", "Spring Boot",
            "MongoDB", "SQL", "REST API", "Git", "Docker",
            "JavaScript", "HTML5", "CSS3", "AWS", "Agile", "TypeScript"
        ));
        
        // DevOps Engineer Keywords
        roleKeywords.put("DevOps Engineer", Arrays.asList(
            "Docker", "Kubernetes", "Jenkins", "AWS", "Linux",
            "Terraform", "Ansible", "CI/CD", "Python", "Bash",
            "Git", "Monitoring", "Logging", "Prometheus", "Grafana"
        ));
        
        // Product Manager Keywords
        roleKeywords.put("Product Manager", Arrays.asList(
            "Agile", "Scrum", "Product Strategy", "Market Research",
            "User Stories", "Roadmap", "JIRA", "Analytics", "MVP",
            "Stakeholder Management", "Competitive Analysis", "Wireframing"
        ));
        
        // AI/ML Engineer Keywords
        roleKeywords.put("AI/ML Engineer", Arrays.asList(
            "Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
            "NLP", "Computer Vision", "Pandas", "NumPy", "Scikit-learn",
            "SQL", "Docker", "AWS", "Model Deployment", "LLM", "RAG"
        ));
    }
    
    public List<String> getKeywordsForRole(String role) {
        return roleKeywords.getOrDefault(role, roleKeywords.get("Software Engineer"));
    }
    
    public List<String> getAllRoles() {
        return new ArrayList<>(roleKeywords.keySet());
    }
    
    public List<String> findFoundKeywords(String resumeText, String role) {
        List<String> keywords = getKeywordsForRole(role);
        List<String> found = new ArrayList<>();
        String lowerText = resumeText.toLowerCase();
        
        for (String keyword : keywords) {
            if (lowerText.contains(keyword.toLowerCase())) {
                found.add(keyword);
            }
        }
        return found;
    }
    
    public List<String> findMissingKeywords(String resumeText, String role) {
        List<String> keywords = getKeywordsForRole(role);
        List<String> missing = new ArrayList<>();
        String lowerText = resumeText.toLowerCase();
        
        for (String keyword : keywords) {
            if (!lowerText.contains(keyword.toLowerCase())) {
                missing.add(keyword);
            }
        }
        return missing;
    }
    
    public int calculateScore(String resumeText, String role) {
        List<String> keywords = getKeywordsForRole(role);
        String lowerText = resumeText.toLowerCase();
        
        long foundCount = keywords.stream()
            .filter(kw -> lowerText.contains(kw.toLowerCase()))
            .count();
        
        return (int) ((foundCount * 100) / keywords.size());
    }
    
    public List<String> generateSuggestions(List<String> missingKeywords, String role) {
        List<String> suggestions = new ArrayList<>();
        
        if (missingKeywords.isEmpty()) {
            suggestions.add("🎉 Excellent! Your resume contains all key keywords for " + role);
        } else {
            suggestions.add("📌 Add these missing keywords: " + String.join(", ", missingKeywords));
            suggestions.add("💡 Include a dedicated 'Skills' section with relevant technologies");
            suggestions.add("📊 Add quantifiable achievements (e.g., 'Improved performance by 30%')");
            suggestions.add("⚡ Use action verbs like 'Developed', 'Led', 'Implemented', 'Architected'");
        }
        
        // Role-specific suggestions
        if (role.contains("Software") || role.contains("Developer")) {
            suggestions.add("🔗 Highlight your GitHub projects and contributions");
            suggestions.add("🏗️ Mention specific frameworks and libraries you've used");
        } else if (role.contains("Data")) {
            suggestions.add("📈 Showcase your data science projects with results");
            suggestions.add("🔗 Include links to Kaggle or GitHub repositories");
        } else if (role.contains("DevOps")) {
            suggestions.add("🔄 Mention CI/CD pipelines you've built");
            suggestions.add("☁️ List specific cloud services you've worked with");
        }
        
        suggestions.add("📝 Keep formatting simple for ATS scanners");
        suggestions.add("🎯 Tailor your resume for each job application");
        
        return suggestions;
    }
}