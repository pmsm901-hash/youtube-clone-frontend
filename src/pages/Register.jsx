import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register=()=>{
    const { register }=useAuth();
    const navigate=useNavigate();
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        if(!username || !email || !password || !confirmPassword)
        {
            setError("All Fields Are required");
            return;
        }
        if(username.length < 3)
        {
            setError("Username contain at least 3 characters");
            return;
        }
        if(password.length < 6)
        {
            setError("Password must contain at least 6 characters ");
            return;
        }
        if(password !==confirmPassword)
        {
            setError("Password & Confirm Password do not match");
            return;
        }
        try
        {
            setLoading(true);
            await register(username,email,password);
            navigate("/login",{state:{registered:true}});
        }
        catch(error)
        {
            setError(error.response?.data?.message || "Registration failed");
        }
        finally
        {
            setLoading(false);
        }
    }
        return(
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                      ▶
                </div>
                <h1>Create Account</h1>
                <p>Join YouTUbe Clone</p>
                {error &&(
                    <div className="form-error">
                        {error}
                    </div>
                )}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type="text" placeholder="Enter Username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <label>E-mail</label>
                    <input type="email" placeholder="Enter E-mail" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <label>Password</label>
                    <input type="password" placeholder="Enter Password (Minimum 6 characters)" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                    <button type="submit" className="primary-button" disabled={loading}>
                        {loading ?"Creating..." :"Create Account"}
                    </button>
               
                </form>
                <p className="auth-switch">Already Have an Account ?
                    <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
        )
};
export default Register;