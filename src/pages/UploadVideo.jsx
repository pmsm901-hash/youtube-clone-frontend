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
    e.preventDefault();

    setError("");

    console.log("CHANNEL ID:", channelId);

    if (!title.trim()) {
      setError("Video title is required");
      return;
    }

    if (!videoUrl.trim()) {
      setError("Video URL is required");
      return;
    }

    if (!thumbnailUrl.trim()) {
      setError("Thumbnail URL is required");
      return;
    }

    if (!category) {
      setError("Category is required");
      return;
    }

    if (!channelId) {
      setError("Channel ID is missing");
      return;
    }

    try {
      setLoading(true);

      const videoData = {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        category: category.trim(),
        channelId: channelId,
      };

      console.log("VIDEO DATA:", videoData);

      const response = await api.post("/videos", videoData);

      console.log("UPLOAD RESPONSE:", response.data);

      if (response.data.success) {
        alert("Video Uploaded Successfully....!!");

        navigate(`/channel/${channelId}`);
      }
    } catch (error) {
      console.error("UPLOAD VIDEO ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to Upload Video"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <div className="form-card wide">

        <h1>Upload Video</h1>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          className="dashboard-form"
          onSubmit={handleSubmit}
        >
          <label>Video Title *</label>

          <input
            type="text"
            placeholder="Enter Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>

          <textarea
            placeholder="Describe your Video"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <label>Video URL *</label>

          <input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
          />

          <label>Thumbnail URL *</label>

          <input
            type="url"
            placeholder="https://example.com/thumbnail.jpg"
            value={thumbnailUrl}
            onChange={(e) =>
              setThumbnailUrl(e.target.value)
            }
          />

          <label>Category *</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Uploading Video...."
              : "Upload Video"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadVideo;