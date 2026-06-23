import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaUserCircle, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "general";

  // Dynamic Date string formatting
  const [currentDateStr, setCurrentDateStr] = useState("");
  useEffect(() => {
    const options = { weekday: "long", year: "numeric", month: "short", day: "2-digit" };
    const dateStr = new Date().toLocaleDateString("en-US", options);
    setCurrentDateStr(dateStr);
  }, []);

  // Decode JWT email on client side
  const getEmailFromToken = (jwtToken) => {
    if (!jwtToken) return "";
    try {
      const payloadBase64 = jwtToken.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      return decoded.sub; // sub field stores email
    } catch (e) {
      return "";
    }
  };

  const userEmail = getEmailFromToken(token);

  const categories = [
    { id: "general", label: "General" },
    { id: "business", label: "Business" },
    { id: "technology", label: "Technology" },
    { id: "health", label: "Health" },
    { id: "sports", label: "Sports" },
    { id: "science", label: "Science" },
    { id: "entertainment", label: "Entertainment" },
  ];

  return (
    <header className="w-full bg-black text-white border-b border-gray-800">
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full border-b border-gray-900 bg-gray-950/40 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400 font-medium">
          {/* Left: Date / Live status / Mock Weather */}
          <div className="flex items-center gap-4">
            <span>{currentDateStr || "Loading date..."}</span>
            <span className="h-3 w-px bg-gray-800" />
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              Live Updates
            </span>
            <span className="h-3 w-px bg-gray-800" />
            <span className="text-gray-300">🌤️ 26°C, Systemized</span>
          </div>

          {/* Right: Auth settings */}
          <div className="flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-300 font-mono hidden sm:inline">{userEmail}</span>
                <span className="h-3 w-px bg-gray-800 hidden sm:inline" />
                <Link
                  to="/saved"
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition font-semibold"
                >
                  <FaBookmark className="text-xs" />
                  Saved Bookmarks
                </Link>
                <span className="h-3 w-px bg-gray-800" />
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition font-semibold"
                >
                  <FaSignOutAlt className="text-xs" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-white transition">Sign In</Link>
                <span className="h-3 w-px bg-gray-800" />
                <Link to="/register" className="hover:text-white transition">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CENTERED MASTHEAD TITLE */}
      <div className="header select-none bg-black">
        <Link to="/" className="inline-block group">
          <img 
            src="/images/meridian-logo.png" 
            alt="The Meridian Times" 
            className="site-logo transition duration-300 group-hover:opacity-85"
          />
        </Link>
      </div>

      {/* 3. DUAL-BORDERED NAVIGATION CATEGORIES */}
      <div className="w-full border-t border-b border-gray-800/80 bg-gray-950/20 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/dashboard?category=${cat.id}`}
                className={`text-xs md:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition duration-200 ${
                  activeCategory === cat.id
                    ? "text-purple-400 hover:text-purple-300 border-b-2 border-purple-500 pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
