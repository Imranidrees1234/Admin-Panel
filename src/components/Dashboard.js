import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import ViewUser from "./ViewUser";
import "./Dashboard.css";
import DeleteUser from "./Deleteuser";
import Admin from "./Admin";
import UploadImage from "./UploadImage";
import Signup from "./Signup";
import UpdateUserRole from "./UpdateUserRole";
import TrackDriver from "./TrackDriver";
import Test from "./Test";
import Deleteimage from "./Deleteimage";
import Video from "./Video";

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <div className="dashboard-container">
                <aside className="sidebar">
                    <ul>
                        <li><Link to="/dashboard/viewuser">View Users</Link></li>
                        <li><Link to="/dashboard/deleteuser">Delete User</Link></li>
                        <li><Link to="/dashboard/admin">Notification</Link></li>
                        <li><Link to="/dashboard/trackdriver">Track Driver</Link></li>
                        <li><Link to="/dashboard/uploadimage">Upload Image</Link></li>
                        <li><Link to="/dashboard/deleteimage">Delete Image</Link></li>
                        <li><Link to="/dashboard/updateUserrole">Update User Role</Link></li>
                        <li><Link to="/dashboard/signup">Signup</Link></li>
                        <li><Link to="/dashboard/test">Test</Link></li>
                        <li><Link to="/dashboard/video">Video</Link></li>
                        {/* Open VideoVerification in a new tab */}
                        {/* <li><a href="/video">Video</a></li> */}
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <h1>Welcome to the Admin Dashboard</h1>
                                <p>Select an option from the sidebar to manage users and content.</p>
                            </>
                        } />
                        <Route path="viewuser" element={<ViewUser />} />
                        <Route path="deleteuser" element={<DeleteUser />} />
                        <Route path="admin" element={<Admin />} />
                        <Route path="trackdriver" element={<TrackDriver />} />
                        <Route path="uploadimage" element={<UploadImage />} />
                        <Route path="deleteimage" element={<Deleteimage />} />
                        <Route path="updateUserrole" element={<UpdateUserRole />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="test" element={<Test />} />
                        <Route path="video" element={<Video />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
