import React, { useEffect, useState } from "react";
import axios from "axios";

const DeleteUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    setError("Authorization token missing");
                    return;
                }
                const { data } = await axios.get("https://database-backend-production.up.railway.app/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch users");
            }
        };

        fetchUsers();
    }, []);


    const handleDelete = async (userId) => {
        // ✅ Added confirmation prompt
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return; // Stop if user cancels deletion
    
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                setError("Authorization token missing");
                return;
            }
    
            console.log("Attempting to delete user with ID:", userId);
    
            const response = await axios.delete(`https://database-backend-production.up.railway.app/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("Delete response:", response.data);
    
            // ✅ Remove deleted user from state
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    
            // ✅ Added success alert
            // alert("User deleted successfully!");
        } catch (err) {
            console.error("Error deleting user:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to delete user");
        }
    };
    
    

    return (
        <div>
            <h2>Delete Users (Admin Only)</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteUser;
