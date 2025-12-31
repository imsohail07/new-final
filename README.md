# 📰 NewsHub – Full-Stack News Aggregator Platform

**NewsHub** is a modern, production-ready **full-stack news aggregation platform** that fetches, processes, and delivers real-time news from multiple sources.  
It provides users with a personalized experience to browse headlines, search topics, securely save articles, and manage reading lists — all built with **scalable backend architecture and cloud-native deployment practices**.

---

## ✨ Key Highlights

- 🌍 Aggregates real-time news from multiple external APIs  
- 🔍 Advanced keyword-based news search  
- 👤 Secure user authentication with JWT  
- 💾 Save & manage favorite articles  
- 🚫 Duplicate article prevention at database level  
- 📱 Fully responsive UI (desktop & mobile)  
- 🔐 Secure REST APIs with Spring Security  
- 🐳 Dockerized & Kubernetes-ready deployment  

---

## 🚀 Features

### 📰 News Browsing
- View **top headlines** across multiple categories:
  - General
  - Business
  - Technology
  - Health
  - Sports
  - Entertainment
- Clean and minimal UI for distraction-free reading

### 🔎 Search Engine
- Search news articles using **keywords**
- Optimized API calls to avoid unnecessary requests

### 👤 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Secure access to saved articles

### ⭐ Saved Articles
- Save articles for later reading
- Prevents duplicate saves automatically
- Delete saved articles anytime

### ⚙️ Backend Capabilities
- RESTful APIs
- Database-level uniqueness checks
- CORS enabled for frontend-backend communication

---

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4**
- **Spring Security + JWT**
- **Spring Data JPA**
- **MySQL**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Axios**
- **React Router**

### DevOps & Cloud
- **Docker**
- **Docker Compose**
- **Kubernetes**
- **kubectl**

---

## 📂 Project Structure

```text
news-aggregator/
│
├── news-aggregator-backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── news-aggregator-frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── k8s/                 # Kubernetes manifests
├── docker-compose.yml
└── README.md
