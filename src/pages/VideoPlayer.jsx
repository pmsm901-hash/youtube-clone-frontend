import { useEffect,useState } from "react";
import { Link,useNavigate, useParams } from "react-router-dom";
import { FiThumbsUp,FiThumbsDown } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Comment from "../components/Comment";

const VideoPlayer=()=>{
    const{id}=useParams();
    const navigate=useNavigate();
    const {user}=useAuth();
    const [video,setVideo]=useState(null);
    const [comments,setComments]=useState([]);
    const [commentText,setCommentText]=useState("");
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    useEffect(()=>{
        loadVideo();
        loadComments();
    },[id]);
    const loadVideo=async()=>{
        try
        {
            setLoading(true);
            const response=await api.get(`/videos/${id}`);
            setVideo(response.data.video);
        }
        catch(error)
        {
            setError("Unable to Load Video");
        }
        finally
        {
            setLoading(false);
        }
    }
    const loadComments=async()=>{
        try
        {
            const response=await api.get(`/comments/video/${id}`);
            setComments(response.data.comments);
        }
        catch(error)
        {
            console.error(error);
        }
    }
    const requireLogin=()=>{
        if(!user)
        {
            navigate("/login",{state:{from:`/video/${id}`}});
            return false;
        }
        return true;
    }
    const handleLike=async()=>{
        if(!requireLogin())
        {
            return;
        }
        try
        {
            await api.post(`/video/${id}/like`);
            await loadVideo();
        }
        catch(error)
        {
            console.log(error);
        }
    }
    const handleDislike=async()=>{
        if(!requireLogin())
        {
            return;
        }
        try
        {
            await api.post(`/video/${id}/dislike`);
            await loadVideo();
        }
        catch(error)
        {
            console.error(error);
        }
    }
    const addComment=async(e)=>{
        e.preventDefault();
        if(!requireLogin())
        {
            return;
        }
        if(!commentText.trim())
        {
            return;
        }
        try
        {
            const response=await api.post(`/comment/video/${id}`,{text:commentText});
            setComments([response.data.comment,...comments]);
            setCommentText("");
        }
        catch(error)
        {
            alert(error.response?.data?.message || "Unable to add comment");
        }

    }
    const updateComment=async(commentId,text)=>{
        try
        {
            const response=await api.put(`/comments/${commentId}`,{text});
            setComments(comments.map((comment)=>comment._id === commentId ? response.data.comment : comment))
        }
        catch(error)
        {
            alert(error.response?.data?.message || "Unable to Update comment");
        }

    }
    const deleteComment=async(commentId)=>{
        const confirmed=window.confirm("Do You Really want to Delete this comment...??");
        if(!confirmed)
        {
            return;
        }
        try
        {
            await api.delete(`/delete/${commentId}`);
            setComments(comments.filter((comment)=>comment._id !== commentId));
        }
        catch(error)
        {
            alert(error.response?.data?.message || "Unable to delete comment");
        }
    }
    if(loading)
    {
        return(
        <div className="loading-screen">
            Loading Video....
        </div>);
    }
    if(error || !video)
    {
        return(
        <div className="error-message">
            {error || "Video Not Found"}
        </div>);
    }
    return (
    <main className="video-page">
        <div className="video-player-container">
            <video className="video-player" controls poster={video.thumbnailUrl} src={video.videoUrl}/>
        </div>
        <h1 className="video-title">{video.title}</h1>
        <div className="video-details">
            <div className="channel-info">
                <img src={video.channel ?.channelAvatar || "https://i.pravatar.cc/100"} alt=""/>
            </div>
            <div>
                <Link to ={video.channel ? `/channel/${video.channel_id}`:"/"} >
                <strong>{video.channel ?.channelName}</strong>
                </Link>
                <span>{video.channel ?.subscribers || 0} {" subscribers"}</span>
            </div>
        </div>
        <div className="like-buttons">
            <button onClick={handleLike}><FiThumbsUp/>{video.likes?.length || 0}</button>
            <button onClick={handleDislike}><FiThumbsUp/>{video.dislikes?.length || 0}</button>
        </div>
        <div className="video-description">
            <strong>
                {video.views.toLocaleString()}{ "views"}
            </strong>
            <p>{video.description}</p>
        </div>
        <section className="comments-section">
            <h2>{comments.length} { "Comments"}</h2>
            {user ?(
                <form className="comment-form" onSubmit={addComment}>
                        <img src={user.avatar || "https://i.pravatar.cc/100"} alt=""/>
                        <input type="text" placeholder="Add a Comment" value={commentText} onChange={(e)=>setCommentText(e.target.value)}/>
                </form>):
                (<div className="comment-login">
                    <p>Sign in to Comment</p>
                    <button onClick={()=>navigate("/login",{state:{from:`/video/${id}`}})}>Sign In</button>
                </div>)}
                <div className="comment-list">
                    {comments.length===0 ?(
                            <p className="no-comments">
                                No Comments Yet.Be the first to comment!
                            </p>
                    ):(comments.map((comment)=>
                    <Comment key={comment._id} comment={comment} onUpdate={updateComment} onDelete={deleteComment}/>)
                    )
                    }
                </div>
        </section>

    </main>
    );

}
export default VideoPlayer;


