// import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import { Routes, Route } from "react-router-dom";
import ViewUser from "./ViewUser";
import Deleteuser from "./Deleteuser";
import Admin from "./Admin";
import UploadImage from "./UploadImage";
import UpdateUserRole from "./UpdateUserRole";
import Video from "./Video";

const Home = () => {
    return (
        <Routes>
        {/* <Route path="/Navbar" element={<Navbar/>}/> */}
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/viewuser" element={<ViewUser/>}/>
        <Route path="/deleteuser" element={<Deleteuser/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/uploadimage" element={<UploadImage/>}/>
        <Route path="/updateUserrole" element={<UpdateUserRole/>}/>
        <Route path="/video" element={<Video/>}/>
      </Routes>
    );
};

export default Home;
