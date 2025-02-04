import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import { useParams, useNavigate } from "react-router-dom";
import "./addapi.css";
import Compressor from "compressorjs"; // Import Compressor.js

const UpdateApi = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch data from backend when component mounts
    const fetchApiDoc = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/docs/${id}`);
        const apiDoc = response.data;
        setTitle(apiDoc.title);
        setLink(apiDoc.link);
        setShortDescription(apiDoc.short_desc);
        setDescription(apiDoc.description);
        // Set other necessary state values, e.g., images
      } catch (error) {
        console.error("Error fetching API document:", error);
        alert("Error fetching data");
      }
    };

    fetchApiDoc();
  }, [id]); // Trigger on component mount or ID change

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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
    console.log("Updating API...");
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
      const response = await axios.put(`${baseUrl}/api/docs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API updated successfully:", response.data);
      alert("API updated successfully");
      navigate("/users/api-list");
    } catch (error) {
      console.error("Error submitting API update:", error);
      alert("Failed to update API. Please try again.");
    }
  };
  
  

  return (
    <div className="addapi-parent">
      <Dashboard />
      <div className="addapi-form">
        <div className="api-form">
          <h1>Update API</h1>
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
                  required
                /> <br />
                <label htmlFor="api">Api Link*</label> <br />
                <input
                  id="api"
                  type="text"
                  placeholder="Enter API link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                /> <br />
                <div className="d-flex l text-center">
                  <label className="imagel">Image:</label>
                  <input
                    className="cf"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="d-flex">
                  <label htmlFor="shortDescription">Short Description</label> <br />
                  <input
                    id="shortDescription"
                    type="text"
                    placeholder="Enter short description"
                    className="input2"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  /> <br />
                </div>

                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
            <div className="right">
              <div className="b-form">
                <label htmlFor="description" style={{ marginTop: "10px" }}>
                  Description
                </label>
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

export default UpdateApi;
