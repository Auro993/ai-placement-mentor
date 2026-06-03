package com.placement.demo.repository;

import com.placement.demo.entity.Chat;
import com.placement.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUserOrderByCreatedAtDesc(User user);
}