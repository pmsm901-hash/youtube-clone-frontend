import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./uploadvideo.css";

const categories = [
  "Music",
  "Gaming",
  "Coding",
  "News",
  "Sports",
  "Education",
  "Entertainment",
];

const UploadVideo = ({ channelId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("Coding");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("CHANNEL ID:", channelId);
    e.preventDefault();
    setError("");
    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      setError("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/videos", {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        category,
        channel: channelId,
      });
      if (response.data.success) {
        alert("Video Uploaded Successfully....!!");
        navigate(`/channel/${channelId}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Unable to Upload Video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <div className="form-card wide">
        <h1>Upload Video</h1>
        {error && <div className="form-error">{error}</div>}
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <label> Video Title *</label>
          <input
            type="text"
            placeholder="Enter Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Descriotion</label>
          <textarea
            placeholder="Describe your Video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Video URL *</label>
          <input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <label>Thumbnail URL *</label>
          <input
            type="url"
            placeholder="https://example.com/thumbnail.jpg"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Uploading Video...." : "Upload Video"}
          </button>
        </form>
      </div>
    </main>
  );
};
export default UploadVideo;
