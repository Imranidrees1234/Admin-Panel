import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateUserRole = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    setError("Authorization token missing");
                    return;
                }
                const { data } = await axios.get("https://admin-backend-production-4ca3.up.railway.app/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch users");
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("userToken");
            await axios.put(
                `https://admin-backend-production-4ca3.up.railway.app/api/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update role");
        }
    };

    return (
        <div>
            <h2>Update User Role</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="client">Client</option>
                                    <option value="driver">Driver</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UpdateUserRole;
