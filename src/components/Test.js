// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const adminSocket = io("http://localhost:5005/admin");

// const Test = () => {
//     const [requests, setRequests] = useState([]);

//     useEffect(() => {
//         adminSocket.emit("registerAdmin", "admin-123"); // Register Admin

//         adminSocket.on("adminReceiveRequest", (data) => {
//             console.log("📩 Request received:", data);
//             setRequests((prev) => [...prev, data]);
//         });

//         return () => adminSocket.off("adminReceiveRequest");
//     }, []);

//     const handleApproval = (clientId, type) => {
//         adminSocket.emit("approveRequest", { clientId, type, message: "✅ Request Approved" });
//         setRequests((prev) => prev.filter(req => req.clientId !== clientId || req.type !== type));
//     };

//     const handleDenial = (clientId, type) => {
//         adminSocket.emit("denyRequest", { clientId, type, message: "❌ Request Denied" });
//         setRequests((prev) => prev.filter(req => req.clientId !== clientId || req.type !== type));
//     };

//     return (
//         <div>
//             <h2>Admin Dashboard</h2>
//             {requests.length === 0 ? <p>No pending requests.</p> : null}
//             {requests.map((req, index) => (
//                 <div key={index}>
//                     <p>Client ID: {req.clientId}</p>
//                     <p>Request Type: {req.type}</p>
//                     <button onClick={() => handleApproval(req.clientId, req.type)}>✅ Approve</button>
//                     <button onClick={() => handleDenial(req.clientId, req.type)}>❌ Deny</button>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Test;







import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://admin-backend-production-4ca3.up.railway.app/");
const adminSocket = io("https://admin-backend-production-4ca3.up.railway.app/");

const Test = () => {
  const [requests, setRequests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    socket.emit("adminConnected");
    adminSocket.emit("registerAdmin", "admin-123");

    socket.on("receivePermissionRequest", (data) => {
      setRequests((prev) => [...prev, data]);
    });

    adminSocket.on("adminReceiveRequest", (data) => {
      console.log("📩 Request received:", data);
      setRequests((prev) => [...prev, data]);
    });

    fetchImages();

    return () => {
      socket.off("receivePermissionRequest");
      adminSocket.off("adminReceiveRequest");
    };
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedImage(null);
  };

  const handleImageSelection = (image) => {
    setSelectedImage(image);
    setSelectedFile(null);
  };

  const approveRequest = async (clientSocketId) => {
    let imageUrl;

    if (selectedImage) {
      imageUrl = selectedImage;
    } else if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post("https://admin-backend-production-4ca3.up.railway.app/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.imageUrl) {
          imageUrl = response.data.imageUrl;
          await axios.post("https://admin-backend-production-4ca3.up.railway.app/api/save-image", { imageUrl });
        } else {
          alert("Failed to upload image.");
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Error uploading image.");
        return;
      }
    } else {
      alert("Please select or upload an image before approving.");
      return;
    }

    socket.emit("approvePermission", { clientSocketId, imageURL: imageUrl });
    setRequests((prev) => prev.filter((req) => req.clientSocketId !== clientSocketId));
  };

  const denyRequest = (clientSocketId) => {
    socket.emit("denyPermission", { clientSocketId });
    setRequests((prev) => prev.filter((req) => req.clientSocketId !== clientSocketId));
  };

  const handleApproval = (clientId, type) => {
    adminSocket.emit("approveRequest", { clientId, type, message: "✅ Request Approved" });
    setRequests((prev) => prev.filter(req => req.clientId !== clientId || req.type !== type));
  };

  const handleDenial = (clientId, type) => {
    adminSocket.emit("denyRequest", { clientId, type, message: "❌ Request Denied" });
    setRequests((prev) => prev.filter(req => req.clientId !== clientId || req.type !== type));
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("https://admin-backend-production-4ca3.up.railway.app/api/images");
      setImages(response.data.images);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      alert("Error fetching images.");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {requests.length === 0 ? <p>No pending requests.</p> : null}
      {requests.map((req, index) => (
        <div key={index}>
          <p>Client ID: {req.clientId || req.clientSocketId}</p>
          <p>Request Type: {req.type || "Image Request"}</p>
          {req.type ? (
            <>
              <button onClick={() => handleApproval(req.clientId, req.type)}>✅ Approve</button>
              <button onClick={() => handleDenial(req.clientId, req.type)}>❌ Deny</button>
            </>
          ) : (
            <>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button onClick={() => approveRequest(req.clientSocketId)}>Approve & Send Image</button>
              <button onClick={() => denyRequest(req.clientSocketId)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Deny</button>
            </>
          )}
        </div>
      ))}
      <hr />
      <button onClick={() => setShowImages(!showImages)}>
        {showImages ? "Hide Images" : "Show Images"}
      </button>
      {showImages && images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginTop: "20px" }}>
          {images.map((img, index) => (
            <div key={index} onClick={() => handleImageSelection(img.imageUrl)} style={{ cursor: "pointer", border: selectedImage === img.imageUrl ? "3px solid blue" : "none" }}>
              <img src={img.imageUrl} alt="Uploaded" style={{ width: "100%", height: "auto", borderRadius: "5px" }} />
              <p style={{ fontSize: "12px", wordBreak: "break-all" }}>{img.imageUrl}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Test;


















// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5005", {
//   reconnectionAttempts: 5, // Retry connection 5 times if it fails
//   reconnectionDelay: 2000, // Wait 2 seconds before retrying
// });

// const Test = () => {
//   const [requests, setRequests] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     console.log("📡 Connecting Admin to WebSocket...");

//     socket.on("connect", () => {
//       console.log("✅ Admin WebSocket connected:", socket.id);
//       socket.emit("adminConnected");
//     });

//     socket.on("receivePermissionRequest", (data) => {
//       console.log("📩 New request received:", data);
//       setRequests((prev) => [...prev, data]);
//     });

//     socket.on("disconnect", () => {
//       console.warn("⚠️ Admin WebSocket disconnected!");
//     });

//     fetchImages(); // Fetch images on component load

//     return () => {
//       socket.off("connect");
//       socket.off("receivePermissionRequest");
//       socket.off("disconnect");
//     };
//   }, []);

//   const approveRequest = async (clientSocketId) => {
//     if (!clientSocketId) {
//       console.error("❌ Client Socket ID is undefined!");
//       alert("Error: Invalid client request.");
//       return;
//     }

//     let imageUrl;

//     if (selectedImage) {
//       imageUrl = selectedImage;
//     } else if (selectedFile) {
//       const formData = new FormData();
//       formData.append("image", selectedFile);

//       try {
//         const uploadResponse = await axios.post("http://localhost:5005/api/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         if (uploadResponse.data.imageUrl) {
//           imageUrl = uploadResponse.data.imageUrl;
//           console.log("📷 Image uploaded:", imageUrl);

//           await axios.post("http://localhost:5005/api/save-image", { imageUrl });
//         } else {
//           alert("Failed to upload image.");
//           return;
//         }
//       } catch (error) {
//         console.error("❌ Image upload error:", error);
//         alert("Error uploading image.");
//         return;
//       }
//     } else {
//       alert("Please select or upload an image before approving.");
//       return;
//     }

//     console.log(`✅ Sending approval to client ${clientSocketId} with image ${imageUrl}`);
//     socket.emit("approvePermission", { clientSocketId, imageURL: imageUrl });

//     setRequests((prev) => prev.filter((req) => req.clientSocketId !== clientSocketId));
//   };

//   const denyRequest = (clientSocketId) => {
//     socket.emit("denyPermission", { clientSocketId });
//     setRequests((prev) => prev.filter((req) => req.clientSocketId !== clientSocketId));
//   };

//   const fetchImages = async () => {
//     try {
//       const response = await axios.get("http://localhost:5005/api/images");
//       setImages(response.data.images);
//     } catch (error) {
//       console.error("❌ Failed to fetch images:", error);
//       alert("Error fetching images.");
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Panel - Permission Requests</h2>

//       {requests.length > 0 && (
//         <div>
//           <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
//           <button onClick={() => approveRequest(requests[0].clientSocketId)}>
//             Approve & Send Image
//           </button>
//           <button onClick={() => denyRequest(requests[0].clientSocketId)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
//             Deny
//           </button>
//         </div>
//       )}

//       {requests.map((req, index) => (
//         <p key={index}>{req.clientEmail} is requesting an image.</p>
//       ))}
//     </div>
//   );
// };

// export default Test;
