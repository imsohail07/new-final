import { useContext, useEffect, useState } from "react";
import { getTopNews, searchNews } from "../api/newsApi";
import { saveArticle } from "../api/savedApi";
import Loader from "../components/Loader";
import ArticleCard from "../components/ArticleCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Pagination and Infinite Scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState("top"); // "top" or "search"

  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "general";

  useEffect(() => {
    loadTopNews(activeCategory, 1, false);
    setQuery("");
  }, [activeCategory]);

  const loadTopNews = async (category = "general", pageNum = 1, isAppend = false) => {
    if (pageNum === 1) {
      setLoading(true);
    }
    setMode("top");

    const data = await getTopNews(category, pageNum);
    const newArticles = data?.articles || [];

    if (isAppend) {
      setArticles((prev) => [...prev, ...newArticles]);
    } else {
      setArticles(newArticles);
    }

    const total = data?.totalResults || 0;
    const currentLength = isAppend ? articles.length + newArticles.length : newArticles.length;

    if (newArticles.length === 0 || currentLength >= total) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setPage(pageNum);
    if (pageNum === 1) setLoading(false);
  };

  const handleSearch = async (pageNum = 1, isAppend = false) => {
    if (!query.trim()) return;
    if (pageNum === 1) {
      setLoading(true);
    }
    setMode("search");

    const data = await searchNews(query, pageNum);
    const newArticles = data?.articles || [];

    if (isAppend) {
      setArticles((prev) => [...prev, ...newArticles]);
    } else {
      setArticles(newArticles);
    }

    const total = data?.totalResults || 0;
    const currentLength = isAppend ? articles.length + newArticles.length : newArticles.length;

    if (newArticles.length === 0 || currentLength >= total) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setPage(pageNum);
    if (pageNum === 1) setLoading(false);
  };

  const fetchMoreData = () => {
    const nextPage = page + 1;
    if (mode === "top") {
      loadTopNews(activeCategory, nextPage, true);
    } else {
      handleSearch(nextPage, true);
    }
  };

  const handleSave = async (article) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    try {
      await saveArticle({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source?.name || "",
        publishedAt: article.publishedAt,
        content: article.content,
      });
      alert("Article saved successfully!");
    } catch (err) {
      alert("Failed to save article.");
      console.error(err);
    }
  };

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="min-h-screen">

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Header + search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">News Dashboard</h1>
            <p className="text-sm text-slate-300/70">
              Live headlines from your Spring Boot backend (NewsAPI).
            </p>
          </div>

          <div className="flex gap-2">
            <input
              className="px-4 py-2 rounded-lg bg-black/40 border border-slate-700 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search news (e.g. cricket, AI)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium"
            >
              Search
            </button>
            <button
              onClick={loadTopNews}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs md:text-sm"
            >
              Top headlines
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-10">
            <Loader />
          </div>
        )}

        {/* Articles grid */}
        {!loading && articles.length > 0 && (
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center my-8">
                <p className="text-xs text-purple-400 tracking-[0.2em] font-semibold uppercase animate-pulse font-cinzel">
                  Contacting...
                </p>
              </div>
            }
            endMessage={
              <div className="flex justify-center my-8">
                <p className="text-xs text-purple-400/60 tracking-[0.2em] font-semibold uppercase animate-pulse font-cinzel">
                  Contacting...
                </p>
              </div>
            }
          >
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <ArticleCard
                  key={i}
                  article={article}
                  onSave={() => handleSave(article)}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}

        {!loading && articles.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No articles to show. Try a different search query.
          </p>
        )}
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-sm space-y-6 text-center shadow-2xl relative">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Sign In Required
            </h3>
            <p className="text-sm text-gray-400">
              You need to log in or create an account to save articles to your personal bookmarks list.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold p-3 rounded-xl transition duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl transition duration-200 border border-slate-700"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-400 hover:text-gray-200 font-semibold text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
