import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://admin-backend-production-4ca3.up.railway.app/");

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    socket.emit("adminConnected");

    socket.on("receivePermissionRequest", (data) => {
      setRequests((prev) => [...prev, data]);
    });

    fetchImages(); // Fetch images when the component loads

    return () => {
      socket.off("receivePermissionRequest");
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
      <h2>Admin Panel - Permission Requests</h2>

      {requests.length > 0 && (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => approveRequest(requests[0].clientSocketId)}>
            Approve & Send Image
          </button>
          <button onClick={() => denyRequest(requests[0].clientSocketId)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
            Deny
          </button>
        </div>
      )}

      {requests.map((req, index) => (
        <p key={index}>{req.clientEmail} is requesting an image.</p>
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

export default Admin;
