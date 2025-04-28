import React, { useState, useEffect } from "react";

const DeleteImage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://database-backend-production.up.railway.app/api/images")
      .then((response) => response.json())
      .then((data) => {
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          setImages([]); // Ensures it's an array
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setImages([]);
      });
  }, []);

  const handleDelete = async () => {
    if (!selectedImage) {
      setMessage("Please select an image to delete");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://database-backend-production.up.railway.app/api/images/${selectedImage}`, {
        method: "DELETE",
      });
  
      const data = await response.json();  // Parse response
      console.log("Response:", response.status, data);  // Log response
  
      if (response.ok) {
        setImages(images.filter((img) => img._id !== selectedImage));
        setMessage("Image deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete request error:", error);
      setMessage("Error deleting image");
    }
  };
  
  return (
    <div>
      <h2>Delete Image</h2>
      {images.length === 0 ? (
        <p>No images found</p>
      ) : (
        <ul>
          {images.map((image) => (
            <li key={image._id}>
              <img src={image.imageUrl} alt="Uploaded" width="100" />
              <input
                type="radio"
                name="selectedImage"
                value={image._id}
                onChange={() => setSelectedImage(image._id)}
              />
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleDelete} disabled={!selectedImage}>
        Delete Selected Image
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteImage;
