import { useState } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Login=()=>{
    const {login}=useAuth();
    const navigate=useNavigate();
    const location=useLocation();
    const [email,setEmail]=useState(" ");
    const [password,setPassword]=useState(" ");
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const from=location.state ?.from || "/";

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        if(!email || !password)
        {
            setError("Email & Password are required");
            return;
        }
        try
        {
            setLoading(true);
            await login(email,password);
            navigate(from,{replace:true});
        }
        catch(error)
        {
            setError(error.response ?.data?.message || "Login Failed");
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
                        <h1>Sign In</h1>
                        <p>Sign In to continue to YouTube Clone</p>
                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="auth-form">
                            <label>Email</label>
                            <input type="email" placeholder="Enter E-mail" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                            <label>Password</label>
                            <input type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            <button type="submit" className="primary-button" disabled={loading}><FiLogin/>
                            {loading ? "Signing In...":"Sign In"}
                            </button>
                        </form>
                        <p className="auth-switch">Don't Have an Account ?</p>
                        <Link to="/register">Create Account</Link>
                </div>
            </div>
        </div>
);
};
export default Login;