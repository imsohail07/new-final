package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    @Value("${news.api.default.country:us}")
    private String defaultCountry;

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getTopHeadlines(String category, int page) {
        String url = "https://newsapi.org/v2/top-headlines?country=" + defaultCountry + "&category="
                + category + "&apiKey=" + apiKey + "&page=" + page;

        return restTemplate.getForObject(url, Object.class);
    }

    public Object searchNews(String keyword, int page) {
        String url = "https://newsapi.org/v2/everything?q="
                + keyword + "&apiKey=" + apiKey + "&page=" + page;

        return restTemplate.getForObject(url, Object.class);
    }
}
