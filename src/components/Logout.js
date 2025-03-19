import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userToken"); // Remove token from local storage
        localStorage.removeItem("userInfo");  // Remove user info if stored
        navigate("/login"); // Redirect to login page
    };

    return (
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", cursor: "pointer", padding: "10px", border: "none", borderRadius: "5px" }}>
            Logout
        </button>
    );
};

export default Logout;
