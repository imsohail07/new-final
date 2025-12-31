package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.SavedArticle;
import com.example.demo.repository.SavedArticleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/saved-articles")
@RequiredArgsConstructor
public class SavedArticleController {

    private final SavedArticleRepository savedArticleRepository;

    @GetMapping
    public List<SavedArticle> getAll() {
        return savedArticleRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<SavedArticle> save(@RequestBody SavedArticle article) {
        // if you want to hard‑code user for now:
        if (article.getUserEmail() == null || article.getUserEmail().isBlank()) {
            article.setUserEmail("demo@user.com");
        }

        // Check if already saved
        Optional<SavedArticle> existing = savedArticleRepository.findByUserEmailAndUrl(article.getUserEmail(), article.getUrl());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get()); // Return existing
        }

        SavedArticle saved = savedArticleRepository.save(article);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!savedArticleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        savedArticleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
