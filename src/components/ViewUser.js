import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem("userToken");
    
                // Check if token exists
                if (!token) {
                    setError("Authorization token missing");
                    setLoading(false);
                    return;
                }
    
                // Make request with Authorization header
                const { data } = await axios.get("https://admin-backend-production-4ca3.up.railway.app/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch users");
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>All Users</h2>

            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewUser;
