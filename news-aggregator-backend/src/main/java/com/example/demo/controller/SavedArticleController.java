package com.example.demo.controller;

import com.example.demo.model.SavedArticle;
import com.example.demo.repository.SavedArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-articles")
@CrossOrigin(origins = "*")
public class SavedArticleController {

    @Autowired
    private SavedArticleRepository repository;

    // ✅ GET all saved articles
    @GetMapping
    public List<SavedArticle> getAllSaved() {
        return repository.findAll();
    }

    // ✅ SAVE article
    @PostMapping
    public SavedArticle saveArticle(@RequestBody SavedArticle article) {
        return repository.save(article);
    }

    // ✅ DELETE article by ID
    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
