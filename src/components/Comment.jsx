import { useState } from "react";
import { FiEdit2,FiTrash2 } from "react-icons/fi";
import {useAuth} from "../context/AuthContext";

const comment=({comment,onUpdate,onDelete})=>{
    const {user}=useAuth();
    const [editing,setEditing]=useState(false);
    const [text,setText]=useState(comment.text);
    const isOwner=user && comment.user?._id === user.id;
    const handleUpdate=async()=>{
        if(!text.trim())
        {
            return;
        }
        await onUpdate(comment._id,text);
        setEditing(false);
    }
    return (
             <div className="comment">
                <img src={comment.user?.avatar || "https://i.pravatar.cc/100"}
                      alt={comment.user?.username} className="comment-avatar"/>
                      <div className="comment-content">
                        <strong>{comment.user?.username}</strong>
                        {editing ?(
                            <div className="comment-edit">
                                <input value={text} onChange={(e)=>setText(e.target.value)}/>
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={()=>{setText(comment.text);setEditing(false)}}>Cancel</button>
                            </div>
                        ):(<p>{comment.text}</p>)}
                        {isOwner && !editing && (
                            <div className="comment-actions">
                                <button onClick={()=>setEditing(true)}><FiEdit2/>Edit</button>
                                <button onClick={()=>onDelete(comment._id)}><FiTrash2/>Delete</button>
                            </div>
                        )}
                      </div>
             </div>
             )

}