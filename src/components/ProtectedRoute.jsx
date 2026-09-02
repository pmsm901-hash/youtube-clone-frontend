import { Navigate, Outlet } from "react-router-dom";
import { userAuth } from "../context/AuthContext"

const ProtectedRoute=()=>{
    const {user,loading}=userAuth();
    if(loading)
    {
       return(
       <div className="loading-screen">
        Loading....
            </div>);
    }
    if(!user)
    {
        return(<Navigate to="/login" replace/>)
    }
    return <Outlet/>
}
export default ProtectedRoute;