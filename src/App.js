// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import Home from "./components/Home";

// const App = () => {
//   const isAuthenticated = !!localStorage.getItem("userToken");

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </>
//   );
// };

// export default App;




import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
// import ViewUser from "./components/ViewUser"; // Import ViewUser
// import Home from "./components/Home";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("userToken");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Keep Dashboard Mounted */}
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        
      </Routes>
    </>
  );
};

export default App;