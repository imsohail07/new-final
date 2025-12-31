package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "saved_articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who saved (optional – you can keep null for now)
    private String userEmail;

    // News fields
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String url;

    private String source;

    @Column(length = 2000)
    private String imageUrl;

    private String publishedAt;
}
