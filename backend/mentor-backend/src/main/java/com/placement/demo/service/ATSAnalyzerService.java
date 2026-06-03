package com.placement.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ATSAnalyzerService {

    // ==================== 1. KEYWORD & SKILLS ANALYSIS ====================
    
    public KeywordAnalysis analyzeKeywords(String resumeText, String jobDescription, String targetRole) {
        KeywordAnalysis analysis = new KeywordAnalysis();
        
        // Extract hard skills from job description OR use role-based defaults
        List<String> hardSkills = extractHardSkills(jobDescription, targetRole);
        List<String> softSkills = extractSoftSkills(jobDescription);
        
        // If no skills found, use default role-based keywords
        if (hardSkills.isEmpty()) {
            hardSkills = getDefaultKeywordsForRole(targetRole);
        }
        
        // Hard skills matching
        List<KeywordMatch> hardSkillsMatch = new ArrayList<>();
        String lowerResume = resumeText.toLowerCase();
        
        for (String skill : hardSkills) {
            boolean found = lowerResume.contains(skill.toLowerCase());
            int count = countOccurrences(lowerResume, skill.toLowerCase());
            hardSkillsMatch.add(new KeywordMatch(skill, found, count, "HARD"));
        }
        
        // Soft skills matching
        List<KeywordMatch> softSkillsMatch = new ArrayList<>();
        for (String skill : softSkills) {
            boolean found = lowerResume.contains(skill.toLowerCase());
            int count = countOccurrences(lowerResume, skill.toLowerCase());
            softSkillsMatch.add(new KeywordMatch(skill, found, count, "SOFT"));
        }
        
        // Calculate keyword density
        Map<String, Integer> keywordDensity = new HashMap<>();
        for (String skill : hardSkills) {
            int count = countOccurrences(lowerResume, skill.toLowerCase());
            keywordDensity.put(skill, count);
        }
        
        analysis.setHardSkillsMatch(hardSkillsMatch);
        analysis.setSoftSkillsMatch(softSkillsMatch);
        analysis.setKeywordDensity(keywordDensity);
        analysis.setTotalHardSkills(hardSkills.size());
        analysis.setFoundHardSkills((int) hardSkillsMatch.stream().filter(KeywordMatch::isFound).count());
        
        return analysis;
    }
    
    private List<String> getDefaultKeywordsForRole(String role) {
        Map<String, List<String>> defaultKeywords = new HashMap<>();
        defaultKeywords.put("Software Engineer", Arrays.asList(
            "Java", "Python", "JavaScript", "React", "Spring Boot", 
            "AWS", "Docker", "Git", "SQL", "REST API", "Microservices", "JUnit"
        ));
        defaultKeywords.put("Data Scientist", Arrays.asList(
            "Python", "SQL", "Machine Learning", "Pandas", "NumPy", 
            "Statistics", "TensorFlow", "Data Visualization", "Scikit-learn", "Deep Learning"
        ));
        defaultKeywords.put("Frontend Developer", Arrays.asList(
            "React", "JavaScript", "HTML5", "CSS3", "TypeScript", 
            "Angular", "Vue.js", "Redux", "Webpack", "Tailwind CSS"
        ));
        defaultKeywords.put("Backend Developer", Arrays.asList(
            "Java", "Spring Boot", "Python", "Node.js", "SQL", 
            "REST API", "Docker", "Git", "MongoDB", "Microservices"
        ));
        defaultKeywords.put("Full Stack Developer", Arrays.asList(
            "React", "Node.js", "Java", "Python", "SQL", 
            "REST API", "Git", "Docker", "MongoDB", "JavaScript"
        ));
        defaultKeywords.put("DevOps Engineer", Arrays.asList(
            "Docker", "Kubernetes", "Jenkins", "AWS", "Linux", 
            "Terraform", "CI/CD", "Python", "Bash", "Git"
        ));
        defaultKeywords.put("Product Manager", Arrays.asList(
            "Agile", "Scrum", "Product Strategy", "Market Research", 
            "User Stories", "Roadmap", "JIRA", "Analytics", "MVP"
        ));
        defaultKeywords.put("AI/ML Engineer", Arrays.asList(
            "Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
            "NLP", "Computer Vision", "Pandas", "NumPy", "Scikit-learn"
        ));
        
        String lowerRole = role.toLowerCase();
        for (Map.Entry<String, List<String>> entry : defaultKeywords.entrySet()) {
            if (lowerRole.contains(entry.getKey().toLowerCase())) {
                return entry.getValue();
            }
        }
        return defaultKeywords.get("Software Engineer");
    }
    
    private List<String> extractHardSkills(String text, String targetRole) {
        List<String> found = new ArrayList<>();
        String lowerText = text.toLowerCase();
        
        // Expanded hard skills dictionary
        String[] hardSkillsList = {
            "Java", "Python", "JavaScript", "React", "Spring Boot", "AWS", "Docker", "Kubernetes",
            "SQL", "MongoDB", "REST API", "Git", "Jenkins", "TensorFlow", "Pandas", "NumPy",
            "Angular", "Vue.js", "Node.js", "Express", "TypeScript", "HTML5", "CSS3", "Bootstrap",
            "C++", "C#", ".NET", "PHP", "Ruby", "Swift", "Kotlin", "Flutter", "Firebase",
            "Redis", "Kafka", "GraphQL", "Apache", "Nginx", "Linux", "Unix", "JUnit",
            "Selenium", "Postman", "Maven", "Gradle", "Webpack", "Babel", "PyTorch", "Scikit-learn",
            "Spark", "Hadoop", "Tableau", "Power BI", "Excel", "Photoshop", "Figma", "JIRA"
        };
        
        for (String skill : hardSkillsList) {
            if (lowerText.contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        
        return found;
    }
    
    private List<String> extractSoftSkills(String text) {
        List<String> found = new ArrayList<>();
        String lowerText = text.toLowerCase();
        
        String[] softSkillsList = {
            "Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
            "Time Management", "Adaptability", "Creativity", "Collaboration", "Project Management",
            "Analytical", "Organizational", "Presentation", "Negotiation", "Conflict Resolution",
            "Decision Making", "Emotional Intelligence", "Mentoring", "Coaching", "Strategic Planning"
        };
        
        for (String skill : softSkillsList) {
            if (lowerText.contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        return found;
    }
    
    private int countOccurrences(String text, String word) {
        int count = 0;
        int index = 0;
        while ((index = text.indexOf(word, index)) != -1) {
            count++;
            index += word.length();
        }
        return count;
    }
    
    // ==================== 2. FORMATTING & LAYOUT ANALYSIS ====================
    
    public FormattingAnalysis analyzeFormatting(String resumeText) {
        FormattingAnalysis analysis = new FormattingAnalysis();
        List<String> issues = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        // Check for tables
        if (resumeText.contains("table") || resumeText.contains("|") || resumeText.contains("+-")) {
            issues.add("Tables detected - ATS may not parse table content correctly");
        }
        
        // Check for columns
        if (detectColumns(resumeText)) {
            issues.add("Multi-column layout detected - Use single column for better ATS parsing");
        }
        
        // Check for images/graphics
        if (resumeText.contains("image") || resumeText.contains("graphic") || resumeText.contains("photo") || resumeText.contains(".png") || resumeText.contains(".jpg")) {
            warnings.add("Images detected - ATS may skip image content");
        }
        
        // Check paragraph length
        String[] paragraphs = resumeText.split("\\n\\n");
        for (String para : paragraphs) {
            if (para.length() > 500) {
                warnings.add("Very long paragraph detected - Break into smaller paragraphs");
                break;
            }
        }
        
        // Check for special characters
        if (resumeText.contains("•") || resumeText.contains("●") || resumeText.contains("→") || resumeText.contains("◆")) {
            warnings.add("Special characters detected - Use standard bullet points (- or *)");
        }
        
        analysis.setIssues(issues);
        analysis.setWarnings(warnings);
        analysis.setHasTables(!issues.isEmpty() && issues.get(0).contains("Tables"));
        analysis.setHasColumns(!issues.isEmpty() && issues.stream().anyMatch(i -> i.contains("columns")));
        
        return analysis;
    }
    
    private boolean detectColumns(String text) {
        String[] lines = text.split("\\n");
        int tabsCount = 0;
        for (String line : lines) {
            if (line.contains("\t")) {
                tabsCount++;
            }
        }
        return tabsCount > 3;
    }
    
    // ==================== 3. RESUME SECTIONS ANALYSIS ====================
    
    public SectionAnalysis analyzeSections(String resumeText) {
        SectionAnalysis analysis = new SectionAnalysis();
        List<String> foundSections = new ArrayList<>();
        List<String> missingSections = new ArrayList<>();
        Map<String, String> sectionContent = new HashMap<>();
        
        String[] requiredSections = {"Experience", "Education", "Skills", "Projects"};
        String lowerText = resumeText.toLowerCase();
        
        for (String section : requiredSections) {
            if (lowerText.contains(section.toLowerCase())) {
                foundSections.add(section);
                sectionContent.put(section, extractSection(resumeText, section));
            } else {
                missingSections.add(section);
            }
        }
        
        // Check for optional sections
        String[] optionalSections = {"Summary", "Certifications", "Achievements", "Languages", "Publications"};
        for (String section : optionalSections) {
            if (lowerText.contains(section.toLowerCase())) {
                foundSections.add(section);
            }
        }
        
        boolean hasProperHeadings = checkHeadingFormat(resumeText);
        
        String summaryAnalysis = "";
        if (sectionContent.containsKey("Summary")) {
            String summary = sectionContent.get("Summary");
            if (summary.length() < 100) {
                summaryAnalysis = "⚠️ Summary too short - Add more details about your experience";
            } else if (summary.length() > 500) {
                summaryAnalysis = "⚠️ Summary too long - Keep it concise (2-3 sentences)";
            } else {
                summaryAnalysis = "✅ Good summary length";
            }
        } else {
            summaryAnalysis = "⚠️ Missing professional summary - Add a brief introduction";
            missingSections.add("Summary");
        }
        
        analysis.setFoundSections(foundSections);
        analysis.setMissingSections(missingSections);
        analysis.setHasProperHeadings(hasProperHeadings);
        analysis.setSummaryAnalysis(summaryAnalysis);
        analysis.setSectionContent(sectionContent);
        
        return analysis;
    }
    
    private String extractSection(String text, String sectionName) {
        String lowerText = text.toLowerCase();
        int sectionIndex = lowerText.indexOf(sectionName.toLowerCase());
        if (sectionIndex == -1) return "";
        
        int nextSectionIndex = lowerText.length();
        String[] nextSections = {"experience", "education", "skills", "projects", "summary", "certifications", "achievements", "languages"};
        for (String next : nextSections) {
            int idx = lowerText.indexOf(next, sectionIndex + 1);
            if (idx != -1 && idx < nextSectionIndex) {
                nextSectionIndex = idx;
            }
        }
        
        return text.substring(sectionIndex, Math.min(nextSectionIndex, text.length())).trim();
    }
    
    private boolean checkHeadingFormat(String text) {
        String[] lines = text.split("\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() < 30 && trimmed.length() > 2) {
                if (trimmed.equals(trimmed.toUpperCase())) {
                    return true;
                }
            }
        }
        return true;
    }
    
    // ==================== 4. CONTENT QUALITY ANALYSIS ====================
    
    public ContentQualityAnalysis analyzeContentQuality(String resumeText, String jobDescription, String targetRole) {
        ContentQualityAnalysis analysis = new ContentQualityAnalysis();
        List<String> suggestions = new ArrayList<>();
        
        boolean jobTitleMatch = resumeText.toLowerCase().contains(targetRole.toLowerCase());
        analysis.setJobTitleMatch(jobTitleMatch);
        if (!jobTitleMatch) {
            suggestions.add("📌 Add your target role '" + targetRole + "' in your professional summary");
        } else {
            suggestions.add("✅ Target role found in resume");
        }
        
        int experienceYears = extractYearsOfExperience(resumeText);
        analysis.setYearsOfExperience(experienceYears);
        if (experienceYears == 0) {
            suggestions.add("📌 Add years of experience (e.g., '5+ years in software development')");
        } else {
            suggestions.add("✅ " + experienceYears + "+ years of experience detected");
        }
        
        List<String> spellingIssues = checkSpelling(resumeText);
        analysis.setSpellingIssues(spellingIssues);
        
        boolean hasAchievements = checkAchievements(resumeText);
        analysis.setHasAchievements(hasAchievements);
        if (!hasAchievements) {
            suggestions.add("📊 Add quantifiable achievements (e.g., 'Improved performance by 30%')");
        } else {
            suggestions.add("✅ Good! You have measurable achievements");
        }
        
        boolean hasActionVerbs = checkActionVerbs(resumeText);
        analysis.setHasActionVerbs(hasActionVerbs);
        if (!hasActionVerbs) {
            suggestions.add("💪 Use action verbs: 'Developed', 'Led', 'Implemented', 'Created'");
        } else {
            suggestions.add("✅ Strong action verbs detected");
        }
        
        analysis.setSuggestions(suggestions);
        
        return analysis;
    }
    
    private int extractYearsOfExperience(String text) {
        Pattern pattern = Pattern.compile("(\\d+)[+]?\\s*years?");
        Matcher matcher = pattern.matcher(text.toLowerCase());
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }
    
    private List<String> checkSpelling(String text) {
        List<String> issues = new ArrayList<>();
        String[] commonErrors = {
            "manger", "mangement", "recieve", "acheive", "seperate", "definately",
            "occured", "priviledge", "untill", "wich", "dont", "cant", "teh", "recieved"
        };
        
        for (String error : commonErrors) {
            if (text.toLowerCase().contains(error)) {
                issues.add("Spelling: '" + error + "' - Did you mean?");
            }
        }
        return issues;
    }
    
    private boolean checkAchievements(String text) {
        return text.matches(".*\\d+%.*") || 
               text.matches(".*\\d+\\s*(million|thousand|lakh|crore).*") ||
               text.matches(".*\\$\\d+.*") ||
               text.matches(".*\\d+\\s*\\+\\s*years.*");
    }
    
    private boolean checkActionVerbs(String text) {
        String[] verbs = {"Developed", "Led", "Implemented", "Created", "Designed", 
                          "Managed", "Improved", "Increased", "Reduced", "Achieved",
                          "Built", "Launched", "Optimized", "Spearheaded", "Architected",
                          "Engineered", "Deployed", "Migrated", "Orchestrated", "Automated"};
        for (String verb : verbs) {
            if (text.contains(verb)) return true;
        }
        return false;
    }
    
    // ==================== 5. ATS-SPECIFIC DETECTION ====================
    
    public ATSDetection analyzeATSCompatibility(String resumeText) {
        ATSDetection analysis = new ATSDetection();
        List<String> detectedATS = new ArrayList<>();
        List<String> platformTips = new ArrayList<>();
        
        // Check for common ATS patterns
        if (resumeText.contains("Taleo") || resumeText.contains("Oracle")) {
            detectedATS.add("Taleo");
            platformTips.add("For Taleo: Use standard fonts (Arial, Calibri), avoid headers/footers");
        }
        
        if (resumeText.contains("Workday")) {
            detectedATS.add("Workday");
            platformTips.add("For Workday: Use .docx format, avoid special characters");
        }
        
        if (resumeText.contains("iCIMS")) {
            detectedATS.add("iCIMS");
            platformTips.add("For iCIMS: Keep formatting simple, avoid tables");
        }
        
        if (resumeText.contains("Greenhouse")) {
            detectedATS.add("Greenhouse");
            platformTips.add("For Greenhouse: PDF is best, use standard section headings");
        }
        
        // General ATS tips
        platformTips.add("📄 Save as PDF for best ATS compatibility");
        platformTips.add("📝 Use standard section headings: Experience, Education, Skills");
        platformTips.add("🔑 Include exact keywords from job description");
        platformTips.add("📊 Use bullet points instead of long paragraphs");
        platformTips.add("🚫 Avoid tables, columns, and graphics");
        
        // Check for ATS-friendly elements
        boolean hasPDF = true;
        boolean hasStandardFont = !resumeText.contains("�");
        boolean hasNoGraphics = !resumeText.contains("image") && !resumeText.contains("graphic") && !resumeText.contains("photo");
        boolean hasStandardSections = resumeText.toLowerCase().contains("experience") && 
                                      resumeText.toLowerCase().contains("education") &&
                                      resumeText.toLowerCase().contains("skills");
        
        analysis.setDetectedATS(detectedATS);
        analysis.setPlatformTips(platformTips);
        analysis.setHasPDF(hasPDF);
        analysis.setHasStandardFont(hasStandardFont);
        analysis.setHasNoGraphics(hasNoGraphics);
        analysis.setHasStandardSections(hasStandardSections);
        
        return analysis;
    }
    
    // ==================== FINAL SCORE CALCULATION ====================
    
    public int calculateFinalScore(KeywordAnalysis keywordAnalysis, FormattingAnalysis formattingAnalysis,
                                   SectionAnalysis sectionAnalysis, ContentQualityAnalysis contentAnalysis,
                                   ATSDetection atsAnalysis) {
        
        int score = 0;
        
        // 1. Keywords (40 points)
        if (keywordAnalysis.getTotalHardSkills() > 0) {
            int keywordScore = (keywordAnalysis.getFoundHardSkills() * 40) / keywordAnalysis.getTotalHardSkills();
            score += keywordScore;
        } else {
            score += 25;
        }
        
        // 2. Formatting (20 points)
        int formatScore = 20;
        if (formattingAnalysis.isHasTables()) formatScore -= 10;
        if (formattingAnalysis.isHasColumns()) formatScore -= 10;
        formatScore = Math.max(5, formatScore);
        score += formatScore;
        
        // 3. Sections (15 points)
        int sectionScore = 15;
        int missingCount = sectionAnalysis.getMissingSections().size();
        sectionScore -= (missingCount * 4);
        sectionScore = Math.max(5, sectionScore);
        score += sectionScore;
        
        // 4. Content Quality (15 points)
        int contentScore = 5;
        if (contentAnalysis.isJobTitleMatch()) contentScore += 2;
        if (contentAnalysis.isHasAchievements()) contentScore += 3;
        if (contentAnalysis.isHasActionVerbs()) contentScore += 3;
        if (contentAnalysis.getYearsOfExperience() > 0) contentScore += 2;
        contentScore = Math.min(15, contentScore);
        score += contentScore;
        
        // 5. ATS Compatibility (10 points)
        int atsScore = 10;
        if (!atsAnalysis.isHasStandardSections()) atsScore -= 3;
        if (!atsAnalysis.isHasNoGraphics()) atsScore -= 2;
        atsScore = Math.max(5, atsScore);
        score += atsScore;
        
        return Math.min(100, score);
    }
    
    // ==================== COMPLETE ANALYSIS ====================
    
    public CompleteATSResponse getCompleteAnalysis(String resumeText, String jobDescription, String targetRole) {
        CompleteATSResponse response = new CompleteATSResponse();
        
        response.setKeywordAnalysis(analyzeKeywords(resumeText, jobDescription, targetRole));
        response.setFormattingAnalysis(analyzeFormatting(resumeText));
        response.setSectionAnalysis(analyzeSections(resumeText));
        response.setContentQualityAnalysis(analyzeContentQuality(resumeText, jobDescription, targetRole));
        response.setAtsDetection(analyzeATSCompatibility(resumeText));
        
        int finalScore = calculateFinalScore(
            response.getKeywordAnalysis(),
            response.getFormattingAnalysis(),
            response.getSectionAnalysis(),
            response.getContentQualityAnalysis(),
            response.getAtsDetection()
        );
        response.setFinalScore(finalScore);
        
        return response;
    }
    
    // ==================== INNER CLASSES ====================
    
    public static class KeywordAnalysis {
        private List<KeywordMatch> hardSkillsMatch = new ArrayList<>();
        private List<KeywordMatch> softSkillsMatch = new ArrayList<>();
        private Map<String, Integer> keywordDensity = new HashMap<>();
        private int totalHardSkills;
        private int foundHardSkills;
        
        public List<KeywordMatch> getHardSkillsMatch() { return hardSkillsMatch; }
        public void setHardSkillsMatch(List<KeywordMatch> hardSkillsMatch) { this.hardSkillsMatch = hardSkillsMatch; }
        public List<KeywordMatch> getSoftSkillsMatch() { return softSkillsMatch; }
        public void setSoftSkillsMatch(List<KeywordMatch> softSkillsMatch) { this.softSkillsMatch = softSkillsMatch; }
        public Map<String, Integer> getKeywordDensity() { return keywordDensity; }
        public void setKeywordDensity(Map<String, Integer> keywordDensity) { this.keywordDensity = keywordDensity; }
        public int getTotalHardSkills() { return totalHardSkills; }
        public void setTotalHardSkills(int totalHardSkills) { this.totalHardSkills = totalHardSkills; }
        public int getFoundHardSkills() { return foundHardSkills; }
        public void setFoundHardSkills(int foundHardSkills) { this.foundHardSkills = foundHardSkills; }
    }
    
    public static class KeywordMatch {
        private String keyword;
        private boolean found;
        private int count;
        private String type;
        
        public KeywordMatch(String keyword, boolean found, int count, String type) {
            this.keyword = keyword;
            this.found = found;
            this.count = count;
            this.type = type;
        }
        public String getKeyword() { return keyword; }
        public boolean isFound() { return found; }
        public int getCount() { return count; }
        public String getType() { return type; }
    }
    
    public static class FormattingAnalysis {
        private List<String> issues = new ArrayList<>();
        private List<String> warnings = new ArrayList<>();
        private boolean hasTables;
        private boolean hasColumns;
        
        public List<String> getIssues() { return issues; }
        public void setIssues(List<String> issues) { this.issues = issues; }
        public List<String> getWarnings() { return warnings; }
        public void setWarnings(List<String> warnings) { this.warnings = warnings; }
        public boolean isHasTables() { return hasTables; }
        public void setHasTables(boolean hasTables) { this.hasTables = hasTables; }
        public boolean isHasColumns() { return hasColumns; }
        public void setHasColumns(boolean hasColumns) { this.hasColumns = hasColumns; }
    }
    
    public static class SectionAnalysis {
        private List<String> foundSections = new ArrayList<>();
        private List<String> missingSections = new ArrayList<>();
        private boolean hasProperHeadings;
        private String summaryAnalysis;
        private Map<String, String> sectionContent = new HashMap<>();
        
        public List<String> getFoundSections() { return foundSections; }
        public void setFoundSections(List<String> foundSections) { this.foundSections = foundSections; }
        public List<String> getMissingSections() { return missingSections; }
        public void setMissingSections(List<String> missingSections) { this.missingSections = missingSections; }
        public boolean isHasProperHeadings() { return hasProperHeadings; }
        public void setHasProperHeadings(boolean hasProperHeadings) { this.hasProperHeadings = hasProperHeadings; }
        public String getSummaryAnalysis() { return summaryAnalysis; }
        public void setSummaryAnalysis(String summaryAnalysis) { this.summaryAnalysis = summaryAnalysis; }
        public Map<String, String> getSectionContent() { return sectionContent; }
        public void setSectionContent(Map<String, String> sectionContent) { this.sectionContent = sectionContent; }
    }
    
    public static class ContentQualityAnalysis {
        private boolean jobTitleMatch;
        private int yearsOfExperience;
        private List<String> spellingIssues = new ArrayList<>();
        private boolean hasAchievements;
        private boolean hasActionVerbs;
        private List<String> suggestions = new ArrayList<>();
        
        public boolean isJobTitleMatch() { return jobTitleMatch; }
        public void setJobTitleMatch(boolean jobTitleMatch) { this.jobTitleMatch = jobTitleMatch; }
        public int getYearsOfExperience() { return yearsOfExperience; }
        public void setYearsOfExperience(int yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
        public List<String> getSpellingIssues() { return spellingIssues; }
        public void setSpellingIssues(List<String> spellingIssues) { this.spellingIssues = spellingIssues; }
        public boolean isHasAchievements() { return hasAchievements; }
        public void setHasAchievements(boolean hasAchievements) { this.hasAchievements = hasAchievements; }
        public boolean isHasActionVerbs() { return hasActionVerbs; }
        public void setHasActionVerbs(boolean hasActionVerbs) { this.hasActionVerbs = hasActionVerbs; }
        public List<String> getSuggestions() { return suggestions; }
        public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    }
    
    public static class ATSDetection {
        private List<String> detectedATS = new ArrayList<>();
        private List<String> platformTips = new ArrayList<>();
        private boolean hasPDF;
        private boolean hasStandardFont;
        private boolean hasNoGraphics;
        private boolean hasStandardSections;
        
        public List<String> getDetectedATS() { return detectedATS; }
        public void setDetectedATS(List<String> detectedATS) { this.detectedATS = detectedATS; }
        public List<String> getPlatformTips() { return platformTips; }
        public void setPlatformTips(List<String> platformTips) { this.platformTips = platformTips; }
        public boolean isHasPDF() { return hasPDF; }
        public void setHasPDF(boolean hasPDF) { this.hasPDF = hasPDF; }
        public boolean isHasStandardFont() { return hasStandardFont; }
        public void setHasStandardFont(boolean hasStandardFont) { this.hasStandardFont = hasStandardFont; }
        public boolean isHasNoGraphics() { return hasNoGraphics; }
        public void setHasNoGraphics(boolean hasNoGraphics) { this.hasNoGraphics = hasNoGraphics; }
        public boolean isHasStandardSections() { return hasStandardSections; }
        public void setHasStandardSections(boolean hasStandardSections) { this.hasStandardSections = hasStandardSections; }
    }
    
    public static class CompleteATSResponse {
        private int finalScore;
        private KeywordAnalysis keywordAnalysis;
        private FormattingAnalysis formattingAnalysis;
        private SectionAnalysis sectionAnalysis;
        private ContentQualityAnalysis contentQualityAnalysis;
        private ATSDetection atsDetection;
        
        public int getFinalScore() { return finalScore; }
        public void setFinalScore(int finalScore) { this.finalScore = finalScore; }
        public KeywordAnalysis getKeywordAnalysis() { return keywordAnalysis; }
        public void setKeywordAnalysis(KeywordAnalysis keywordAnalysis) { this.keywordAnalysis = keywordAnalysis; }
        public FormattingAnalysis getFormattingAnalysis() { return formattingAnalysis; }
        public void setFormattingAnalysis(FormattingAnalysis formattingAnalysis) { this.formattingAnalysis = formattingAnalysis; }
        public SectionAnalysis getSectionAnalysis() { return sectionAnalysis; }
        public void setSectionAnalysis(SectionAnalysis sectionAnalysis) { this.sectionAnalysis = sectionAnalysis; }
        public ContentQualityAnalysis getContentQualityAnalysis() { return contentQualityAnalysis; }
        public void setContentQualityAnalysis(ContentQualityAnalysis contentQualityAnalysis) { this.contentQualityAnalysis = contentQualityAnalysis; }
        public ATSDetection getAtsDetection() { return atsDetection; }
        public void setAtsDetection(ATSDetection atsDetection) { this.atsDetection = atsDetection; }
    }
}