package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.NewsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/top")
    public Object getTopNews(
            @RequestParam(defaultValue = "general") String category) {
        return newsService.getTopHeadlines(category);
    }

    @GetMapping("/search")
    public Object search(@RequestParam String q) {
        return newsService.searchNews(q);
    }
}
