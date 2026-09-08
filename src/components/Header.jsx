import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

import {
    FiMenu,
    FiSearch,
    FiUser,
    FiLogOut,
    FiVideo
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

const Header = ({onMenuClick}) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useAuth();
   // console.log("USER:", user);
    //search
    const handleSearch = (e) => {
        e.preventDefault();
        const keyword=search.trim();
        if(!keyword)
        {
            //if searchbox is empty go back to home
            navigate("/");
            return;
        }

       
        navigate(`/?search=${encodeURIComponent(keyword)}`);        
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const getInitial=()=>{
        const name=user?.username || user?.name || user?.email || "U";
        return name.charAt(0).toUpperCase();
    }

    return (
        <header className="header">

            <div className="header-left">
                <button type="button" className="menu-btn" onClick={onMenuClick} aria-label="Toggle Sidebar">
                    <FiMenu size={24} />
                </button>

                <Link to="/" className="logo">
                    YouTube
                </Link>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit">
                    <FiSearch size={22} />
                </button>
            </form>

            <div className="header-right">

                {user ? (
                    <>
                        <Link to="/upload" className="upload-btn">
                            <FiVideo />
                            Upload
                        </Link>
                        <span className="username">{user.username}</span>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn">
                        <FiUser />
                        Login
                    </Link>
                )}

            </div>

        </header>
    );
};

export default Header;