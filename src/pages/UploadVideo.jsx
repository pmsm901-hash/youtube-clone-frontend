import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const categories=["Music","Gaming","Coding","News","Sports","Education","Entertainment"];

const UploadVideo=({channelId})=>{
    const navigate=useNavigate();
    const [title,setTitle]=useState("");
    const [descrition,setDescription]=useState("");
    const [videoUrl,setVideoUrl]=useState("");
    const [thumbnailUrl,setThumbnailUrl]=useState("");
    const [category,setCategory]=useState("Coding");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        if(!title || !videoUrl || !thumbnailUrl || !channelId)
        {
            setError("Please fill all required fields");
            return;
        }
        try
        {
            setLoading(true);
            await api.post("/videos",{title,descrition,videoUrl,thumbnailUrl,category,channelId});
            navigate("/channel");
        }
        catch(error)
        {
            setError(error.response?.data?.message || "Unable to Upload Video");
        }
        finally
        {
            setLoading(false);
        }
    };

    return(
    <main className="form-page">
        <div className="form-card wide">
            <h1>Upload Video</h1>
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}
            <form className="dashboard-form" onSubmit={handleSubmit}>
                <label> Video Title *</label>
                <input type="text" placeholder="Enter Video Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                <label>Descriotion</label>
                <textarea placeholder="Describe your Video" value={descrition} onChange={(e)=>setDescription(e.target.value)}/>
                <label>Video URL *</label>
                <input type="url" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)}/>
                <label>Thumbnail URL *</label>
                <input type="url" placeholder="https://example.com/thumbnail.jpg" value={thumbnailUrl} onChange={(e)=>setThumbnailUrl(e.target.value)}/>
                 <label>Category *</label>
                <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                    {categories.map((item)=>
                    <option key={item} value={item}>{item}</option>
                    )}
                </select>
                <button className="primary-button" type="submit" onSubmit={handleSubmit} disabled={loading}>
                    {loading ? "Uploading Video...." : "Upload Video"}
                </button>
                </form>
        </div>
    </main>)
}
export default UploadVideo;