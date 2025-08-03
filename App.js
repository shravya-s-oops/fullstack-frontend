import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); // "image" must match backend field name

    try {
      const res = await axios.post("http://localhost:3001/api/upload", formData);
      setUploadedUrl(res.data.imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Image to Cloudinary</h2>
      <input type
