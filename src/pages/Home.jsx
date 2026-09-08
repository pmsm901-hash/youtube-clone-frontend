import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import CategoryBar from "../components/CategoryBar";
import VideoCard from "../components/VideoCard";
import "./home.css";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    fetchVideos();
  }, [search, selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      // Search
      if (search.trim()) {
        params.search = search.trim();
      }

      // Category
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      console.log("Fetching videos with params:", params);

      const response = await api.get("/videos", {
        params,
      });

      console.log("Videos response:", response.data);

      if (response.data.success) {
        setVideos(response.data.videos || []);
      } else {
        setVideos([]);

        setError(response.data.message || "Unable to load videos");
      }
    } catch (error) {
      console.error("Fetch videos error:", error);

      setVideos([]);

      setError(error.response?.data?.message || "Unable to load videos");
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  return (
    <main className="home-page">
      <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      <div className="home-content">
        {search.trim() && (
          <div className="search-result">
            Search results for:
            <strong> "{search}"</strong>
            <button
              type="button"
              className="clear-search-btn"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-screen">Loading Videos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : videos.length === 0 ? (
          <div className="empty-state">
            <h2>No Videos Found</h2>

            <p>Try another search or category.</p>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
