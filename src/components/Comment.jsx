import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import "./comment.css";

const Comment = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);

  const [text, setText] = useState(comment.text || "");

  const [updating, setUpdating] = useState(false);

  const currentUserId = user?.id || user?._id;

  const commentUserId = comment.user?._id || comment.user?.id;

  const isOwner = Boolean(
    currentUserId &&
    commentUserId &&
    String(currentUserId) === String(commentUserId),
  );

  const handleEdit = () => {
    setText(comment.text || "");

    setEditing(true);
  };

  const handleCancel = () => {
    setText(comment.text || "");

    setEditing(false);
  };

  const handleUpdate = async () => {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    if (cleanText === comment.text) {
      setEditing(false);
      return;
    }

    try {
      setUpdating(true);

      await onUpdate(comment._id, cleanText);

      setEditing(false);
    } catch (error) {
      console.error("Update comment error:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="comment">
     

      <img
        src={comment.user?.avatar || "https://i.pravatar.cc/100"}
        alt={comment.user?.username || "User"}
        className="comment-avatar"
      />

      <div className="comment-content">
        <strong>{comment.user?.username || "Unknown User"}</strong>

        {editing ? (
          <div className="comment-edit">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              autoFocus
            />

            <div className="comment-edit-actions">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updating || !text.trim()}
              >
                <FiCheck />

                {updating ? "Saving..." : "Save"}
              </button>

              <button type="button" onClick={handleCancel} disabled={updating}>
                <FiX />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}

        {isOwner && !editing && (
          <div className="comment-actions">
            <button type="button" onClick={handleEdit}>
              <FiEdit2 />
              Edit
            </button>

            <button type="button" onClick={() => onDelete(comment._id)}>
              <FiTrash2 />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
