package com.placement.demo.repository;

import com.placement.demo.entity.Resume;
import com.placement.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    List<Resume> findByUserAndTypeOrderByUploadedAtDesc(User user, String type);
}