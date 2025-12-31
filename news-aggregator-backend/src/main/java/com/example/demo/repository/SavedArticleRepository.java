package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.SavedArticle;

public interface SavedArticleRepository extends JpaRepository<SavedArticle, Long> {

    // for future when you add users:
    List<SavedArticle> findByUserEmail(String userEmail);

    Optional<SavedArticle> findByUserEmailAndUrl(String userEmail, String url);
}
