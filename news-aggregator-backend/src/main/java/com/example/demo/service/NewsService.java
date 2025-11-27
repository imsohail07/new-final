package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getTopHeadlines(String category) {
        String url = "https://newsapi.org/v2/top-headlines?country=in&category="
                + category + "&apiKey=" + apiKey;

        return restTemplate.getForObject(url, Object.class);
    }

    public Object searchNews(String keyword) {
        String url = "https://newsapi.org/v2/everything?q="
                + keyword + "&apiKey=" + apiKey;

        return restTemplate.getForObject(url, Object.class);
    }
}
