import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiVideo,
  FiClock,
  FiThumbsUp,
  FiMenu,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-mobile-header">
          <button type="button" onClick={onClose} className="icon-button">
            <FiMenu />
          </button>
          <strong>YouTube</strong>
        </div>

        <nav>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={onClose}
          >
            <FiHome />
            <span>Home</span>
          </Link>

          {user && (
            <Link
              to="/channel"
              className={location.pathname === "/channel" ? "active" : ""}
              onClick={onClose}
            >
              <FiUser />
              <span>Your Channel</span>
            </Link>
          )}

          <Link to="/" onClick={onClose}>
            <FiVideo />
            <span>Subscriptions</span>
          </Link>

          <Link to="/" onClick={onClose}>
            <FiClock />
            <span>History</span>
          </Link>

          <Link to="/" onClick={onClose}>
            <FiThumbsUp />
            <span>Liked Videos</span>
          </Link>
        </nav>

        {!user && (
          <div className="sidebar-login">
            <p>Sign in to like videos, comments and subscribe.</p>
            <Link to="/login" className="signin-button" onClick={onClose}>
              <FiUser />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
