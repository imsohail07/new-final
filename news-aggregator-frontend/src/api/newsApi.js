import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// ✅ TOP HEADLINES
export async function getTopNews(category = "general", page = 1) {
  try {
    const res = await axios.get(`${API_BASE_URL}/news/top`, {
      params: { category, page },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching top news:", err);
    return null;
  }
}

// ✅ SEARCH NEWS
export async function searchNews(query, page = 1) {
  try {
    const res = await axios.get(`${API_BASE_URL}/news/search`, {
      params: { q: query, page },
    });
    return res.data;
  } catch (err) {
    console.error("Error searching news:", err);
    return null;
  }
}
