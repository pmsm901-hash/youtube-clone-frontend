
import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

import "./login.css";

const Login = () => {

    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(
        location.state?.email || ""
    );

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(
        location.state?.registered
            ? "Registration successful. Please sign in."
            : ""
    );

    const [loading, setLoading] = useState(false);

    // If user was redirected here from a protected page,
    // send them back there after login.
    const from = location.state?.from || "/";

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const cleanEmail = email.trim();

        if (!cleanEmail || !password.trim()) {
            setError("Email & Password are required");
            return;
        }

        try {

            setLoading(true);

            const response = await login(
                cleanEmail,
                password
            );

            if (response.success) {

                navigate(from, {
                    replace: true
                });

            } else {

                setError(
                    response.message || "Login Failed"
                );
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page-login">

            <div className="auth-card-login">

                <div className="auth-logo-login">
                    ▶
                </div>

                <h1>Sign In</h1>

                <p>
                    Sign in to continue to YouTube Clone
                </p>

                {success && (
                    <div className="form-success-login">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="form-error-login">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form-login"
                >

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter E-mail"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        autoComplete="email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >

                        <FiLogIn />

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>

                </form>

                <p className="auth-switch-login">
                    Don't Have an Account?
                </p>

                <Link to="/register">
                    Create Account
                </Link>

            </div>

        </div>
    );
};

export default Login;

