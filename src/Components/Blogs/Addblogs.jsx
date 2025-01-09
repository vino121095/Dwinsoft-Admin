import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import "./addblogs.css";
import { useParams, useNavigate } from "react-router-dom";
import Compressor from "compressorjs"; // Import Compressor.js
import { ClipLoader } from "react-spinners"; // Import ClipLoader

const Addblogs = () => {
  const [title, setTitle] = useState(""); // State to manage title
  const [shortDescription, setShortDescription] = useState(""); // State for short description
  const [description, setDescription] = useState(""); // State for description
  const [selectedFile, setSelectedFile] = useState(null); // State for banner image upload
  const [category, setCategory] = useState([]); // State for category selection
  const [categoryName, setCategoryName] = useState(""); // State for new category input
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [loading, setLoading] = useState(false); // State for loader

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${baseUrl}/api/categories/list`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const handleAddCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!categoryName.trim()) return; // Check for empty input

    try {
      const response = await axios.post(`${baseUrl}/api/categories/add`, {
        category_name: categoryName.trim(),
      });

      setCategoryName(""); // Reset category input
      setCategories([...categories, { category_name: response.data.category_name }]); // Update categories with new category
    } catch (error) {
      console.error("Error adding category:", error);
    }
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
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", shortDescription);
  
    const div = document.createElement("div");
    div.innerHTML = description;
    const images = div.querySelectorAll("img");
  
    for (const img of images) {
      const src = img.src;
  
      if (src.startsWith("data:image")) {
        try {
          console.log("Processing image");
          
          // Convert Base64 to Blob
          const blob = await fetch(src).then((res) => res.blob());
          console.log("Original size:", blob.size / 1024, "KB");
  
          // Compress the image
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
          console.error("Error processing image:", error);
        }
      }
    }
  
    formData.append("description", div.innerHTML);
    formData.append("category", category);
  
    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }
  
    try {
      console.log("trying to send data to backend");
      const response = await axios.post(`${baseUrl}/api/blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Timeout after 60 seconds
      });
      console.log("Data successfully sent to backend");
      alert("Blog created successfully");
      navigate("/blogs/blog-list");
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        alert("Request timed out. Please try again later.");
      } else {
        alert("Failed to create blog. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  return (
    <div className="addblogs-parent">
      <Dashboard />
      <div className="right" id="add-blog">
        <h1>Add New Blog</h1>
        {loading ? (
          <div className="loader-container">
            <ClipLoader color="#4A90E2" loading={loading} size={50} />
            <p>Creating Blog...</p>
          </div>
        ) : (
          <div className="up">
            <div className="left">
              <div className="left-form">
                <form onSubmit={handleSubmit}>
                  <label htmlFor="title">Title</label> <br />
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter your title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                      type="text"
                      id="shortDescription"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      maxLength="200"
                    />
                    <div id="charCount">{shortDescription.length}/200</div>
                  </div>

                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="right">
              <div className="right-form">
                <div className="form-child">
                  <h3>Categories</h3>
                  <div className="categories">
                    {categories.map((category) => (
                      <label key={category.id}>
                        <input
                          type="checkbox"
                          value={category.category_name}
                          onChange={handleCategoryChange}
                        />{" "}
                        {category.category_name}
                      </label>
                    ))}
                  </div>
                  <div className="add-category">
                    <form onSubmit={handleAddCategory}>
                      <input
                        type="text"
                        placeholder="Add new category"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                      <button type="submit" className="add-category-button">
                        Add
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="right right-down">
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
        )}
      </div>
    </div>
  );
};

export default Addblogs;
