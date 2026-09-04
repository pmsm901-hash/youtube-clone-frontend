import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { FiEdit2,FiTrash2,FiPlus } from "react-icons/fi";
import api from "../services/api"
import { useAuth } from "../context/AuthContext";

const Channel=()=>{
    const {id}=useParams();
    const {user}=useAuth();

    const [channel,setChannel]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [editingVideo,setEditingVideo]=useState(null);
    const [editTitle,setEditTitle]=useState("");
    const [editDescription,setEditDescription]=useState("");
    const [category,setCategory]=useState("Coding");
    const [editTumbnail,setEditThumbnail]=useState("");

    useEffect(()=>{
        loadChannel();
    },[id]);

    const loadChannel = async ()=>{
        try
        {
            setLoading(true);
            const url=id ? `/channels/${id}`:`/channels/${user?.channels?.[0]}`;
            const response=await api.get(url);
            setChannel(response.data.channel);

        }
        catch(error)
        {
            setError(error.response?.data?.message || "Unable to load Channel");
        }
        finally
        {
            setLoading(false);
        }
    }
    const isOwner = user && channel && channel.owner?._id === user.id;
    
    const deleteVideo =async(videoId)=>{
        const confirmed=window.confirm("Are you sure want to delete this video?");
        if(!confirmed)
        {
            return;
        }
        try
        {
            await api.delete(`/videos/${videoId}`);
            await loadChannel();
        }
        catch(error)
        {
            alert(error.response?.data?.message || "Unable to delete Video");
        }
    }
    const startEdit=(video)=>{
        setEditingVideo(video);
        setEditTitle(video.title);
        setEditDescription(video.description);
        setCategory(video.category);
        setEditThumbnail(video.thumbnailUrl);

    }
    const updateVideo =async(e)=>{
        e.preventDefault();
        try
        {
            await api.put(`/video/${editingVideo._id}`,{title:editTitle,description:editDescription,category:category,thumbnailUrl:editTumbnail});
            setEditingVideo(null);
            await loadChannel();
        }
        catch(error)
        {
            alert(error.response?.data?.message || "Unable to update video");
        }
    }
    if(loading)
    {
        return(
        <div className="loading-screen">
            Loading Channel....
        </div>);
    }
    if(error)
    {
        return(
        <div className="error-message">
            {error}
        </div>);
    }
    if(!channel)
    {
        return(
        <div className="empty-state">
            Channel Not Found
        </div>);
    }
    return (
    <div className="channel-page">
        <div className="channel-banner" style={{background:`url(${channel.channelBanner})`}}/>
        <div className="channel-header">
            <img src={channel.channelAvatar ||  "https://i.pravatar.cc/150"} alt="" className="channel-avatar"/>
            <div className="channel-header-info">
                <h1>{channel.channelName}</h1>
                <p>@{channel.owner?.username}</p>
                <p>{channel.subscribers}{" Subscribers ."}{channel.videos?.length || 0}{ "videos"}</p>
                <p>{channel.description}</p>
            </div>
            {isOwner && (<Link to ="/upload" className="primary-button"><FiPlus/>Upload Video</Link>)}
        </div>
        <div className="channel-content">
            <h2>Videos</h2>
            {channel.videos?.length === 0 ?(
                <div className="empty-state">
                    <h3>No Videos Yet</h3>
                    {isOwner && (<Link to="/upload" className="primary-button">Upload Your First Video</Link>)}
                </div>
            ):(<div className="channel-video-grid">
                {channel.videos?.map((video)=>{
                    <div className="channel-video-card" key={video._id}>
                        <Link to={`/video/${video._id}`}>
                        <img src={video.thumbnailUrl} alt={video.title}/>
                        </Link>
                        <div className="channel-video-info">
                            <Link to={`/video/${video._id}`}><h3>{video.title}</h3></Link>
                            <p>{video.views}{ "views"}</p>
                            {isOwner && (
                                <div className="video-management">
                                    <button onClick={()=>startEdit(video)}><FiEdit2/>Edit</button>
                                    <button className="danger-button" onClick={()=>deleteVideo(video._id)}><FiTrash2/>Delete</button>
                                </div>
                                )}
                        </div>
                    </div>
                })}

            </div>)}
            {editingVideo && (<div className="modal-overlay">
                <div className="modal">
                    <h2>Edit Video</h2>
                    <form className="dashboard-form" onSubmit={updateVideo}>
                        <label>Title</label>
                        <input value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}/>
                        <label>Description</label>
                        <textarea value={editDescription} onChange={(e)=>setEditDescription(e.target.value)}></textarea>
                        <label>Thumnail URL</label>
                        <input value={editTumbnail} onChange={(e)=>setEditThumbnail(e.target.value)}/>
                        <label>Category</label>
                        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                            <option>Music</option>
                            <option>Gaming</option>
                             <option>Coding</option>
                              <option>News</option>
                               <option>Sports</option>
                                <option>Education</option>
                                 <option>Entertainment</option>
                        </select>
                        <div className="modal-buttons">
                            <button type="submit" className="primary-button">Save Changes</button>
                            <button type="button" onClick={()=>setEditingVideo(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>)}
        </div>
    </div>
    );
}
export default Channel;