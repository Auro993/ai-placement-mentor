package com.placement.demo.controller;

import com.placement.demo.entity.Resume;
import com.placement.demo.entity.User;
import com.placement.demo.repository.ResumeRepository;
import com.placement.demo.repository.UserRepository;
import com.placement.demo.service.KeywordService;
import com.placement.demo.service.ATSAnalyzerService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private KeywordService keywordService;
    
    @Autowired
    private ATSAnalyzerService atsAnalyzerService;

    private final String uploadDir = "uploads/resumes/";
    private final String builtDir = "uploads/built_resumes/";
    private final String latexDir = "uploads/latex/";
    private final String coverDir = "uploads/cover_letters/";

    private User getUser() {
        return userRepository.findById(1L).orElse(null);
    }

    private String extractTextFromPDF(String filePath) throws IOException {
        File file = new File(filePath);
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    // ==================== UPLOAD & MANAGE RESUME ====================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            String extractedText = extractTextFromPDF(filePath.toString());
            
            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(file.getOriginalFilename())
                    .filePath(filePath.toString())
                    .type("UPLOADED")
                    .extractedText(extractedText)
                    .build();
            
            Resume savedResume = resumeRepository.save(resume);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedResume.getId());
            response.put("fileName", savedResume.getFileName());
            response.put("uploadedAt", savedResume.getUploadedAt());
            response.put("message", "Resume uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    // ==================== BASIC ANALYSIS ====================
    
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody Map<String, String> request) {
        try {
            String targetRole = request.get("targetRole");
            
            if (targetRole == null || targetRole.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Target role is required"));
            }
            
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            List<Resume> resumes = resumeRepository.findByUserOrderByUploadedAtDesc(user);
            if (resumes.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No resume found. Please upload a resume first."));
            }
            
            Resume latestResume = resumes.get(0);
            String resumeText = latestResume.getExtractedText();
            
            if (resumeText == null || resumeText.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Could not extract text from resume. Please upload a valid PDF."));
            }
            
            int atsScore = keywordService.calculateScore(resumeText, targetRole);
            List<String> foundKeywords = keywordService.findFoundKeywords(resumeText, targetRole);
            List<String> missingKeywords = keywordService.findMissingKeywords(resumeText, targetRole);
            List<String> suggestions = keywordService.generateSuggestions(missingKeywords, targetRole);
            
            Map<String, Object> analysis = new HashMap<>();
            analysis.put("atsScore", atsScore);
            analysis.put("foundKeywords", foundKeywords);
            analysis.put("missingKeywords", missingKeywords);
            analysis.put("suggestions", suggestions);
            analysis.put("totalKeywords", keywordService.getKeywordsForRole(targetRole).size());
            analysis.put("message", "Analysis complete based on keyword matching");
            
            return ResponseEntity.ok(analysis);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }
    
    // ==================== ADVANCED ANALYSIS (Jobscan Style) ====================
    
    @PostMapping("/analyze-advanced")
    public ResponseEntity<?> advancedAnalyze(@RequestBody Map<String, String> request) {
        try {
            String targetRole = request.get("targetRole");
            String jobDescription = request.getOrDefault("jobDescription", "");
            
            if (targetRole == null || targetRole.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Target role is required"));
            }
            
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            List<Resume> resumes = resumeRepository.findByUserOrderByUploadedAtDesc(user);
            if (resumes.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No resume found. Please upload a resume first."));
            }
            
            Resume latestResume = resumes.get(0);
            String resumeText = latestResume.getExtractedText();
            
            if (resumeText == null || resumeText.isEmpty()) {
                // Provide sample text for testing
                resumeText = "Experienced " + targetRole + " with 5+ years of experience. " +
                           "Skills include Java, Python, React, Spring Boot, AWS, Docker, SQL. " +
                           "Education: B.Tech in Computer Science. " +
                           "Experience: Developed microservices, improved performance by 30%.";
            }
            
            ATSAnalyzerService.CompleteATSResponse analysis = 
                atsAnalyzerService.getCompleteAnalysis(resumeText, jobDescription, targetRole);
            
            return ResponseEntity.ok(analysis);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Advanced analysis failed: " + e.getMessage()));
        }
    }
    
    // ==================== DEBUG ENDPOINT ====================
    
    @GetMapping("/debug/extracted-text")
    public ResponseEntity<?> getExtractedText() {
        try {
            User user = getUser();
            List<Resume> resumes = resumeRepository.findByUserOrderByUploadedAtDesc(user);
            if (resumes.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No resume found"));
            }
            
            Resume latest = resumes.get(0);
            String text = latest.getExtractedText();
            
            Map<String, Object> result = new HashMap<>();
            result.put("hasText", text != null && !text.isEmpty());
            result.put("length", text != null ? text.length() : 0);
            result.put("fileName", latest.getFileName());
            result.put("uploadedAt", latest.getUploadedAt());
            if (text != null && text.length() > 0) {
                result.put("preview", text.substring(0, Math.min(500, text.length())));
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(keywordService.getAllRoles());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getUserResumes() {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.ok(List.of());
            }
            List<Resume> resumes = resumeRepository.findByUserOrderByUploadedAtDesc(user);
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {
        try {
            User user = getUser();
            Resume resume = resumeRepository.findById(id).orElse(null);
            if (resume == null || !resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get(resume.getFilePath());
            if (Files.exists(filePath)) {
                Files.deleteIfExists(filePath);
            }
            
            resumeRepository.delete(resume);
            return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadResume(@PathVariable Long id) {
        try {
            User user = getUser();
            Resume resume = resumeRepository.findById(id).orElse(null);
            if (resume == null || !resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get(resume.getFilePath());
            byte[] fileContent = Files.readAllBytes(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + resume.getFileName() + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== RESUME TEMPLATES ====================

    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates() {
        List<Map<String, Object>> templates = Arrays.asList(
            Map.of("id", "1", "name", "Modern", "description", "Clean and contemporary design", "color", "#06b6d4"),
            Map.of("id", "2", "name", "Professional", "description", "Traditional corporate style", "color", "#3b82f6"),
            Map.of("id", "3", "name", "Creative", "description", "Bold and innovative layout", "color", "#a855f7"),
            Map.of("id", "4", "name", "Technical", "description", "Perfect for IT roles", "color", "#10b981"),
            Map.of("id", "5", "name", "Executive", "description", "For leadership positions", "color", "#f59e0b")
        );
        return ResponseEntity.ok(templates);
    }

    // ==================== RESUME BUILDER ====================

    @PostMapping("/builder/save")
    public ResponseEntity<?> saveBuiltResume(@RequestBody Map<String, Object> request) {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            String templateId = (String) request.get("templateId");
            String content = (String) request.get("content");
            String fileName = (String) request.get("fileName");
            
            Path builtPath = Paths.get(builtDir);
            if (!Files.exists(builtPath)) {
                Files.createDirectories(builtPath);
            }
            
            String jsonFileName = UUID.randomUUID().toString() + "_" + fileName + ".json";
            Path jsonPath = builtPath.resolve(jsonFileName);
            Files.writeString(jsonPath, content);
            
            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(fileName + "_built.pdf")
                    .filePath(jsonPath.toString())
                    .type("BUILT")
                    .templateId(templateId)
                    .resumeData(content)
                    .build();
            
            Resume savedResume = resumeRepository.save(resume);
            
            return ResponseEntity.ok(Map.of(
                "id", savedResume.getId(),
                "message", "Resume saved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== LATEX EDITOR ====================

    @PostMapping("/latex/save")
    public ResponseEntity<?> saveLatexContent(@RequestBody Map<String, String> request) {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            String content = request.get("content");
            String fileName = request.get("fileName");
            
            Path latexPath = Paths.get(latexDir);
            if (!Files.exists(latexPath)) {
                Files.createDirectories(latexPath);
            }
            
            String latexFileName = UUID.randomUUID().toString() + "_" + fileName + ".tex";
            Path filePath = latexPath.resolve(latexFileName);
            Files.writeString(filePath, content);
            
            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(fileName + ".tex")
                    .filePath(filePath.toString())
                    .type("LATEX")
                    .resumeData(content)
                    .build();
            
            resumeRepository.save(resume);
            
            return ResponseEntity.ok(Map.of("message", "LaTeX content saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== COVER LETTER ====================

    @PostMapping("/cover-letter/save")
    public ResponseEntity<?> saveCoverLetter(@RequestBody Map<String, String> request) {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            String content = request.get("content");
            String company = request.get("company");
            String position = request.get("position");
            
            Path coverPath = Paths.get(coverDir);
            if (!Files.exists(coverPath)) {
                Files.createDirectories(coverPath);
            }
            
            String fileName = UUID.randomUUID().toString() + "_" + company + "_" + position + ".txt";
            Path filePath = coverPath.resolve(fileName);
            Files.writeString(filePath, content);
            
            Resume resume = Resume.builder()
                    .user(user)
                    .fileName("Cover_Letter_" + company + ".pdf")
                    .filePath(filePath.toString())
                    .type("COVER_LETTER")
                    .resumeData(content)
                    .build();
            
            resumeRepository.save(resume);
            
            return ResponseEntity.ok(Map.of("message", "Cover letter saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== PROGRESS TRACKING ====================

    @GetMapping("/progress")
    public ResponseEntity<?> getUserProgress() {
        try {
            User user = getUser();
            if (user == null) {
                return ResponseEntity.ok(Map.of());
            }
            
            List<Resume> allResumes = resumeRepository.findByUserOrderByUploadedAtDesc(user);
            
            long totalUploads = allResumes.stream().filter(r -> "UPLOADED".equals(r.getType())).count();
            long totalBuilt = allResumes.stream().filter(r -> "BUILT".equals(r.getType())).count();
            long totalLatex = allResumes.stream().filter(r -> "LATEX".equals(r.getType())).count();
            long totalCoverLetters = allResumes.stream().filter(r -> "COVER_LETTER".equals(r.getType())).count();
            
            Map<String, Object> progress = new HashMap<>();
            progress.put("totalResumes", allResumes.size());
            progress.put("totalUploads", totalUploads);
            progress.put("totalBuilt", totalBuilt);
            progress.put("totalLatex", totalLatex);
            progress.put("totalCoverLetters", totalCoverLetters);
            progress.put("lastUpload", allResumes.isEmpty() ? null : allResumes.get(0).getUploadedAt());
            
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}