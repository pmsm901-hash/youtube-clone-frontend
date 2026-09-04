import { useState } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
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

const AppContent=()=>{
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [search,setSearch]=useState("");
  const {user}=useAuth;

  return(
            <div className="app">
              <Header onMenuClick={()=>sidebarOpen(!sidebarOpen)} search={search} setSearch={setSearch}/>
              <Sidebar open={sidebarOpen} onClose={()=>sidebarOpen(false)}/>
                <div className="main-container">
                  <Routes>
                    <Route path="/" element={<Home search={search} setSearch={setSearch}/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/video/:id" element={<VideoPlayer/>}/>
                    <Route path="/channel/:id" element={<Channel/>}/>
                    <Route element={<ProtectedRoute/>}/>
                    <Route path="/channel" element={user?.channels?.length ?(<Channel/>):(<CreateChannel/>)}/>
                    <Route path="/uplaod" element={<ChannelUploadWrapper/>}/>
                    <Route path="*" element={<div className="empty-state"><h1>404</h1><p>Page Not Found</p></div>}></Route>
                  </Routes>
                </div>
            </div>
            );
};
const ChannelUploadWrapper=()=>{
  const {user}=useAuth();
  const channelId=user?.channels?.[0];
  if(!channelId)
  {
    return(<CreateChannel/>)
  }
  return(<UploadVideo channelId={channelId}/>)
};
const App=()=>{
  return(
    <BrowserRouter>
    <AppContent/>
    </BrowserRouter>
  );

}
export default App;