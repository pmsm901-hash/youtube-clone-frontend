import { Link } from "react-router-dom";
const formatViews=(views)=>{
    if(views>=1000000)
    {
        return((views/1000000).toFixed(1)+"M views");
    }
    if(views >= 1000)
    {
        return((views/1000).toFixed(1)+"K views");
    }
    return `${views} views`
}

const formatDate=(date)=>{
    const uploadDate=new Date(date);
    return uploadDate.toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"});
}
const VideoCard=({video})=>{
    return(
        <Link to ={`video/${video._id}`} className="video-card">
            <div className="thumbnail-container">
                <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail"></img>
            </div>
            <div className="video-text">
                <h3>{video.title}</h3>
                <p className="channel-name">
                    {video.channel ?.channelName || "Unknown Channel"}
                </p>
                <p className="video-meta">
                    {formatViews(video.views)}{"."}{formatDate(video.createdAt)}
                </p>
            </div>
        </Link>
    )
}
export default VideoCard;