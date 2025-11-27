package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.SavedArticle;

public interface SavedArticleRepository extends JpaRepository<SavedArticle, Long> {
}
