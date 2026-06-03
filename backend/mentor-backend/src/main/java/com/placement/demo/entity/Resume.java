package com.placement.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    // New fields for enhanced features
    private String type;  // UPLOADED, BUILT, LATEX, COVER_LETTER
    
    private String templateId;  // For built resumes
    
    @Column(columnDefinition = "LONGTEXT")
    private String resumeData;  // JSON data for built resumes
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
        if (type == null) {
            type = "UPLOADED";
        }
    }
}