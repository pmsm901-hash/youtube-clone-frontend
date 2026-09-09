import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";

import { useAuth } from "./context/AuthContext";
import api from "./services/api";

const getChannelId = (channel) => {
  if (!channel) return null;

  if (typeof channel === "string") {
    return channel;
  }

  return channel._id || channel.id || null;
};

const getUserId = (user) => {
  if (!user) return null;

  return user._id || user.id || null;
};

const getUserChannel = (user) => {
  if (!user) return null;

  const channels = user.channels || user.channel;

  if (!channels) {
    return null;
  }

  if (Array.isArray(channels)) {
    return channels.length > 0 ? channels[0] : null;
  }

  return channels;
};

const findMyChannel = async (user) => {
  if (!user) {
    return null;
  }

  const userId = getUserId(user);

  if (!userId) {
    return null;
  }

  const userChannel = getUserChannel(user);
  const userChannelId = getChannelId(userChannel);

  if (userChannelId) {
    return {
      _id: userChannelId,
    };
  }

  const response = await api.get("/channels");
  const channels = response.data?.channels || [];

  const myChannel = channels.find((channel) => {
    const ownerId =
      channel.owner?._id ||
      channel.owner?.id ||
      channel.owner;

    return String(ownerId) === String(userId);
  });

  return myChannel || null;
};

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      <Header
        onMenuClick={toggleSidebar}
        search={search}
        setSearch={setSearch}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/video/:id" element={<VideoPlayer />} />

          <Route path="/channel/:id" element={<Channel />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/channel"
              element={<ChannelRedirect />}
            />

            <Route
              path="/create-channel"
              element={<CreateChannel />}
            />

            <Route
              path="/upload"
              element={<ChannelUploadWrapper />}
            />
          </Route>

          <Route
            path="*"
            element={
              <div className="empty-state">
                <h1>404</h1>
                <p>Page Not Found</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const ChannelRedirect = () => {
  const { user, loading } = useAuth();

  const [channelId, setChannelId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkChannel = async () => {
      if (loading) {
        return;
      }

      if (!user) {
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        const channel = await findMyChannel(user);

        if (channel) {
          setChannelId(getChannelId(channel));
        } else {
          setChannelId(null);
        }
      } catch (error) {
        console.error("CHANNEL CHECK ERROR:", error);
        setChannelId(null);
      } finally {
        setChecking(false);
      }
    };

    checkChannel();
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="loading-screen">
        Checking your channel...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (channelId) {
    return (
      <Navigate
        to={`/channel/${channelId}`}
        replace
      />
    );
  }

  return (
    <Navigate
      to="/create-channel"
      replace
    />
  );
};

const ChannelUploadWrapper = () => {
  const { user, loading } = useAuth();

  const [channelId, setChannelId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkChannel = async () => {
      if (loading) {
        return;
      }

      if (!user) {
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        const channel = await findMyChannel(user);

        if (channel) {
          setChannelId(getChannelId(channel));
        } else {
          setChannelId(null);
        }
      } catch (error) {
        console.error("UPLOAD CHANNEL ERROR:", error);
        setChannelId(null);
      } finally {
        setChecking(false);
      }
    };

    checkChannel();
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="loading-screen">
        Checking your channel...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!channelId) {
    return (
      <Navigate
        to="/create-channel"
        replace
      />
    );
  }

  return <UploadVideo channelId={channelId} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;