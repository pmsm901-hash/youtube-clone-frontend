import { Children, createContext,useContext,useEffect,useState } from "react";

import api from "../services/api";

const AuthContext=createContext();
export const AuthProvider=({children})=>{

    const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);
    useEffect(()=>{
        const token=localStorage.getItem("youtube_token");
        if(!token)
        {
            setLoading(false);
            return;
        }
        //getting current user
        const getCurrentUser=async()=>{
            try
            {
                const response=await api.get("/auth/me");
                if(response.data.success)
                {
                    setUser(response.data.user);
                }

            }
            catch(error)
            {
                    console.log("Authentication failed");
                    localStorage.removeItem("youtube_token");
            }
            finally
            {
                 setLoading(false);
            }
            
        };
        getCurrentUser();
        

    },[]);

    //login a user
    const login=async(email,password)=>{
        const response=await api.post("/auth/login",{email,password});
        if(response.data.success)
        {
            localStorage.setItem("youtube_token",response.data.token);
            setUser(response.data.User);
        }
        return response.data;
    };

    //registering a user
    const register=async(username,email,password)=>{
        const response=await api.post("/auth/register",{username,email,password});
        return response.data;
    }

    //logout a user
    const logout=()=>{
        localStorage.removeItem("youtube_token");
        setUser(null);
        window.location.href="/";
    };

    return (<AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>)

};
export const useAuth=()=>{
    return useContext(AuthContext);
}