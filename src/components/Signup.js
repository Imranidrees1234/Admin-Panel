import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("https://database-backend-production.up.railway.app/api/auth/register", { name, email, password });

            // Store token in localStorage
            localStorage.setItem("userToken", data.token);

            setMessage("Signup successful!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signup;
