import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("https://database-backend-production.up.railway.app/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Image uploaded successfully!");
      console.log("Image URL:", res.data.imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}
      <br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default UploadImage;
