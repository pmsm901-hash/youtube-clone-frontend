import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./channel.css";

const Channel = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [category, setCategory] = useState("Coding");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadChannel();
  }, [id, user]);

  const loadChannel = async () => {
    try {
      setLoading(true);
      setError("");
      const channelId = id || user?.channels?.[0];
      if (!channelId) {
        setChannel(null);
        setLoading(false);
        return;
      }
      const response = await api.get(`/channels/${channelId}`);
      setChannel(response.data.channel);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load Channel");
    } finally {
      setLoading(false);
    }
  };
  const isOwner =
    Boolean(user && channel) &&
    String(channel.owner?._id || channel.owner) === String(user._id || user.id);

  const deleteVideo = async (videoId) => {
    if (!videoId) {
      alert("Video ID is missing");
      return;
    }
    const confirmed = window.confirm("Are you sure want to delete this video?");
    if (!confirmed) {
      return;
    }
    try {
      setDeletingId(videoId);
      console.log("deletingvideo", videoId);
      const response = await api.delete(`/videos/${videoId}`);
      console.log("delete response=>", response.data);
      alert("Video Deleted Successfully...");

      await loadChannel();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete Video");
    } finally {
      setDeletingId(null);
    }
  };
  const startEdit = (video) => {
    console.log("Editing Video", video);
    setEditingVideo(video);
    setEditTitle(video.title || "");
    setEditDescription(video.description || "");
    setCategory(video.category || "");
    setEditThumbnail(video.thumbnailUrl || "");
    setEditVideoUrl(video.videoUrl || "");
  };
  const closeEdit = () => {
    setEditingVideo(null);
    setEditTitle("");
    setEditDescription("");
    setCategory("Coding");
    setEditThumbnail("");
    setEditVideoUrl("");
  };
  const updateVideo = async (e) => {
    e.preventDefault();

    if (!editingVideo?._id) {
      return;
    }
    if (!editTitle.trim()) {
      alert("Video title is required");
      return;
    }
    if (!editVideoUrl.trim()) {
      alert("YouTube URL is required");
      return;
    }
    try {
      setUpdating(true);
      const videoId = editingVideo._id;
      console.log("updating video", videoId);
      const response = await api.put(`/videos/${videoId}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category,
        videoUrl: editVideoUrl.trim(),

        thumbnailUrl: editThumbnail.trim(),
      });
      console.log("update response", response.data);
      closeEdit();
      await loadChannel();
      alert("Video Updated Successfully...");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update video");
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return <div className="loading-screen">Loading Channel....</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (!channel) {
    return (
      <div className="empty-state">
        Channel Not Found
        {user && (
          <Link to="/create-channel" className="primary-button">
            {" "}
            Create Channel{" "}
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="channel-page">
      <div
        className="channel-banner"
        style={{
          background: `url(${channel.channelBanner || "https://images.unsplash.com/photo-1497366754035-f200968a6e72"})`,
        }}
      />
      <div className="channel-header">
        <img
          src={channel.channelAvatar || "https://i.pravatar.cc/150"}
          alt=""
          className="channel-avatar"
        />
        <div className="channel-header-info">
          <h1>{channel.channelName}</h1>
          <p>@{channel.owner?.username}</p>
          <p>
            {channel.subscribers}
            {" Subscribers ."}
            {channel.videos?.length || 0}
            {"videos"}
          </p>
          <p>{channel.description}</p>
        </div>
        {isOwner && (
          <Link to="/upload" className="primary-button">
            <FiPlus size={18} />
            Upload Video
          </Link>
        )}
      </div>
      <div className="channel-content">
        <h2>Videos</h2>
        {channel.videos?.length === 0 ? (
          <div className="empty-state">
            <h3>No Videos Yet</h3>
            {isOwner && (
              <Link to="/upload" className="primary-button">
                <FiPlus size={18} />
                Upload Your First Video
              </Link>
            )}
          </div>
        ) : (
          <div className="channel-video-grid">
            {channel.videos.map((video) => (
              <div className="channel-video-card" key={video._id}>
                <Link to={`/video/${video._id}`}>
                  <img src={video.thumbnailUrl} alt={video.title} />
                </Link>
                <div className="channel-video-info">
                  <Link to={`/video/${video._id}`}>
                    <h3>{video.title}</h3>
                  </Link>
                  <p>
                    {video.views || 0}
                    {"views"}
                  </p>
                  {isOwner && (
                    <div className="video-management">
                      <button
                        type="button"
                        onClick={() => startEdit(video)}
                        disabled={deletingId === video._id}
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => deleteVideo(video._id)}
                        disabled={deletingId === video._id}
                      >
                        <FiTrash2 size={16} />
                        <span>
                          {" "}
                          {deletingId === video._id
                            ? "Deleting..."
                            : "Delete"}{" "}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {editingVideo && (
          <div className="modal-overlay" onClick={closeEdit}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Video</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={closeEdit}
                >
                  <FiX size={22} />
                </button>
              </div>

              <form className="dashboard-form" onSubmit={updateVideo}>
                <label htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
                <label htmlFor="edit-video-url"> Video URL</label>
                <input
                  type="text"
                  id="edit-video-url"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  required
                />
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={5}
                ></textarea>
                <label htmlFor="edit-thumbnail">Thumnail URL</label>
                <input
                  type="text"
                  id="edit-thumbnail"
                  value={editThumbnail}
                  onChange={(e) => setEditThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Music</option>
                  <option>Gaming</option>
                  <option>Coding</option>
                  <option>News</option>
                  <option>Sports</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                </select>
                <div className="modal-buttons">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={closeEdit} disabled={updating}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Channel;
