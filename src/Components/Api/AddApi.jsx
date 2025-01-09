import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import "./addapi.css";
import { useParams, useNavigate } from "react-router-dom";
import Compressor from "compressorjs"; // Import Compressor.js


const AddApi = () => {
  const [title, setTitle] = useState(""); // State to manage title
  const [link, setLink] = useState(""); // State to manage title
  const [shortDescription, setShortDescription] = useState(""); // State for short description
  const [description, setDescription] = useState(""); // State for description
  const [selectedFile, setSelectedFile] = useState(null); // State for banner image upload
  const navigate = useNavigate();



 const compressImage = (file) => {
     return new Promise((resolve, reject) => {
       const targetSize = 40 * 1024; // Target size (40KB)
       const minQuality = 0.1; // Minimum compression quality
       let quality = 0.2; // Aggressive starting quality
       let maxWidth = 600; // Max width to drastically reduce resolution
       let maxHeight = 600; // Max height to drastically reduce resolution
   
       const compress = (blob) => {
         if (quality < minQuality) {
           console.warn("Image compression reached minimum quality but could not meet target size:", blob.size / 1024, "KB");
           resolve(blob); // Return the best possible result
           return;
         }
   
         console.log("Compressing image with quality:", quality);
   
         new Compressor(blob, {
           quality, // Aggressive compression quality
           maxWidth, // Force resizing
           maxHeight, // Force resizing
           success(result) {
             console.log("Compression successful, new size:", result.size / 1024, "KB");
   
             if (result.size <= targetSize) {
               console.log("Image within acceptable size range.");
               resolve(result); // If size is within acceptable range, accept it
             } else if (result.size > targetSize) {
               // If the size is too large, reduce quality more
               console.log("Image still too large. Reducing quality...");
               quality -= 0.05;
               compress(result); // Retry compression
             } else {
               // If the image is too small, do not increase quality
               console.log("Image is too small, but it meets the size requirement.");
               resolve(result); // Accept it as is
             }
           },
           error(err) {
             console.error("Compression error:", err);
             reject(err);
           },
         });
       };
   
       compress(file); // Start the compression process
     });
   };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("short_desc", shortDescription);
  
    const div = document.createElement("div");
    div.innerHTML = description;
    const images = div.querySelectorAll("img");
  
    for (const img of images) {
      const src = img.src;
  
      if (src.startsWith("data:image")) {
        try {
          const blob = await fetch(src).then((res) => res.blob());
          console.log("Original size:", blob.size / 1024, "KB");
  
          const compressedBlob = await compressImage(blob);
          console.log("Compressed size:", compressedBlob.size / 1024, "KB");
  
          // Convert compressed Blob to Data URL (Base64)
          const base64CompressedImage = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(compressedBlob);
          });
  
          console.log("Updating image source.");
          img.src = base64CompressedImage;
        } catch (error) {
          console.error("Image compression failed:", error);
        }
      }
    }
  
    formData.append("description", div.innerHTML);
  
    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }
  
    console.log("Form data to be sent:", {
          title,
          link,
          short_desc: shortDescription,
          description: div.innerHTML,
          bannerImage: selectedFile,
        });

    try {
      const response = await axios.post(`${baseUrl}/api/docs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Api created successfully:", response.data);
      alert("Api created successfully");
      navigate("/users/api-list");
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to create Api. Please try again.");
    }
  };
  
  // Handle file changes for image uploads
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);


  return (
    <div className="addapi-parent">
      <Dashboard />
      <div className="addapi-form">
        <div className="api-form">
          <h1>Add API</h1>
          <div className="childform">
            <div className="left">
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title*</label> <br />
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                /> <br />
                <label htmlFor="title">API link*</label> <br />
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your title"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                /> <br />
                <label htmlFor="shortDescription">Short Description</label> <br />
                <input
                  id="shortDescription"
                  type="text"
                  placeholder="Enter short description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                /> <br />
                <label className="imagel">Banner Image:</label>
                <input
                  className="cf"
                  type="file"
                  onChange={handleFileChange}
                />
                <br />

                <br />
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
            <div className="right">
              <div className="b-form">
                <label htmlFor="description">Description</label>
                <ReactQuill
                                value={description}
                                onChange={setDescription}
                                modules={{
                                  toolbar: [
                                    ["bold", "italic", "underline", "strike"],
                                    [{ header: [1, 2, 3, false] }],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["link", "image"],
                                    [{ align: [] }],
                                    ["clean"],
                                  ],
                                }}
                                formats={[
                                  "header",
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strike",
                                  "list",
                                  "bullet",
                                  "link",
                                  "image",
                                  "align",
                                ]}
                                placeholder="Write the blog content here..."
                              />
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddApi;
