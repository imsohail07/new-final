import axios from "axios";

const API_BASE_URL = "http://localhost:8095/api/saved-articles";

// ✅ GET all saved articles
export async function getSavedArticles() {
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Error loading saved articles:", err);
    return [];
  }
}

// ✅ SAVE an article (✅ WITH PROPER FIELD MAPPING)
export async function saveArticle(article) {
  try {
    const payload = {
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source?.name || "Unknown",
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      userEmail: "demo@user.com", // later replace with logged-in user
    };

    const res = await axios.post(API_BASE_URL, payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error saving article:", err);
    throw err;
  }
}

// ✅ DELETE a saved article
export async function removeSavedArticle(id) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error removing saved article:", err);
    throw err;
  }
}
