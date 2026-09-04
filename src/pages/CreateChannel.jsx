import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateChannel=()=>{
    const navigate=useNavigate();
    const [channelName,setChannelName]=useState("");
    const [description,setDescrition]=useState("");
    const [channelBanner,setChannelBanner]=useState("");
    const [channelAvatar,setChannelAvatar]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        if(!channelName.trim())
        {
            setError("Channel Name id Required");
            return;
        }
        try
        {
            setLoading(true);
            const response=await api.post("/channels",{channelName,description,channelBanner,channelAvatar});
            if(response.data.success)
            {
                navigate("/channel");
            }
        }
        catch(error)
        {
            setError(error.response?.data?.message || "Unable to create Channel");
        }
        finally
        {
            setLoading(false);
        }
    }
    return(
    <main className="form-page">
        <div className="form-card">
            <h1>Create Your Channel</h1>
            <p>Start Sharing your videos with the world</p>
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="dashboard-form">
                <label> Channel Name *</label>
                <input type="text" placeholder="Enter Your Channel Name" value={channelName} onChange={(e)=>setChannelName(e.target.value)}/>
                <label>Description</label>
                <textarea placeholder="Description your channel" value={description} onChange={(e)=>setDescrition(e.target.value)}/>
                <label>Channel Banner URL</label>
                <input type="text" placeholder="https://example.com/banner.jpg" value={channelBanner} onChange={(e)=>setChannelBanner(e.target.value)}/>
                <label>Channel Avatar URL</label>
                <input type="text" placeholder="https://example.com/avatar.jpg" value={channelAvatar} onChange={(e)=>setChannelAvatar(e.target.value)}/>
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? "Creating Channel......":"Create Channel"}
                </button>

            </form>
        </div>
    </main>);
}
export default CreateChannel;