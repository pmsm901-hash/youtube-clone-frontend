import { useState } from "react";
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";

const getChannelId=(channel)=>{
    if(!channel) return null;
    if(typeof channel==="string") return channel;
    return channel._id || channel.id || null;
};

const AppContent=()=>{
    const [sidebarOpen,setSidebarOpen]=useState(false);
    const [search,setSearch]=useState("");
    const {user}=useAuth();

    const toggleSidebar=()=>{
        setSidebarOpen(prev=>!prev);
    };

    const closeSidebar=()=>{
        setSidebarOpen(false);
    };

    return(
        <div className="app">
            <Header onMenuClick={toggleSidebar} search={search} setSearch={setSearch}/>
            <Sidebar open={sidebarOpen} onClose={closeSidebar}/>
            <div className="main-container">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/video/:id" element={<VideoPlayer/>}/>
                    <Route path="/channel/:id" element={<Channel/>}/>
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/channel" element={<ChannelRedirect/>}/>
                        <Route path="/create-channel" element={<CreateChannel/>}/>
                        <Route path="/upload" element={<ChannelUploadWrapper/>}/>
                    </Route>
                    <Route path="*" element={
                        <div className="empty-state">
                            <h1>404</h1>
                            <p>Page Not Found</p>
                        </div>
                    }/>
                </Routes>
            </div>
        </div>
    );
};

const ChannelRedirect=()=>{
    const {user}=useAuth();
    const channelId=getChannelId(user?.channel?.[0]);

    if(!channelId){
        return <Navigate to="/create-channel" replace/>;
    }

    return <Navigate to={`/channel/${channelId}`} replace/>;
};

const ChannelUploadWrapper = () => {
    const { user } = useAuth();

    console.log("USER:", user);
    console.log("CHANNELS:", user?.channels);

    const channelId = getChannelId(user?.channel?.[0]);

    console.log("CHANNEL ID:", channelId);

    if (!channelId) {
        return <Navigate to="/create-channel" replace />;
    }

    return <UploadVideo channelId={channelId} />;
};
const App=()=>{
    return(
        <BrowserRouter>
            <AppContent/>
        </BrowserRouter>
    );
};

export default App;