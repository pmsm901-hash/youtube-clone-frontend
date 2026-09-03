import { useState,useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api  from "../services/api";
import CategoryBar from "../components/CategoryBar";
import VideoCard from "../components/VideoCard";

const Home=({search,setSearch})=>{
    const [videos,setVideos]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [category,setCategory]=useState("All");
    const [searchParams]=useSearchParams();

    useEffect(()=>{
        const urlSearch=searchParams.get("search") || "";
        if(urlSearch !== search)
        {
            setSearch(urlSearch);
        }
    },[searchParams]);

    useEffect(()=>{
        fectchVideos();
    },[search,selectedCategory]);


const fetchVideos=async()=>{
    try
    {
        setLoading(true);
        setError("");
        const params={};
        if(search.trim())
        {
            params.search=search.trim();
        }
        if(selectedCategory!== "All")
        {
            params.category=selectedCategory;
        }
        const response=await api.get("/videos",{params});
        if(response.data.success)
        {
            setVideos(response.data.videos);
        }
    }
    catch(error)
    {
        console.log(error);
        setError(error.response?.data?.message || "Unable to load videos");
    }
    finally{
        setLoading(false);
    }
}
return(
            <main className="home-page">
                <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
                <div className="home-content">
                    {search && (
                        <div className="search-result">
                            Search results for :<strong>{" "}{search}</strong>
                        </div>

                    )}

                    {loading ?(
                        <div className="loading-screen">
                            Loading Videos...
                        </div>
                    ):error ?(<div className="error-message">{error}</div>) :videos.length ===0 ?(
                        <div className="empty-state">
                            <h2>No Videos Found</h2>
                            <p>Try another search or category.</p>
                        </div>
                    ):(
                        <div className="video-grid">
                            {videos.map((video)=>{
                                <VideoCard key={video._id} video={video}/>
                            })}
                        </div>
                    )}
                </div>
            </main>
)
}
export default Home;
