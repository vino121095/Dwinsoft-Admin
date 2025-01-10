import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import { useParams, useNavigate } from "react-router-dom";
import "./addblogs.css";
import Compressor from "compressorjs"; // Import Compressor.js

const UpdateBlogs = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState([]);
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blog`);
        const blogData = response.data;

        const blogToUpdate = blogData.find((b) => b.id === parseInt(id));
        if (blogToUpdate) {
          setBlog(blogToUpdate);
          setTitle(blogToUpdate.title);
          setShortDescription(blogToUpdate.short_desc);
          setDescription(blogToUpdate.description);
          setCategory(
            Array.isArray(blogToUpdate.category)
              ? blogToUpdate.category
              : blogToUpdate.category.split(" ")
          );
        } else {
          console.error("Blog not found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCategory([...category, value]);
    } else {
      setCategory(category.filter((cat) => cat !== value));
    }
  };

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
    formData.append("category", category.join(" "));

    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }

    try {
      const response = await axios.put(`${baseUrl}/api/blog/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog updated successfully");
      navigate("/blogs/blog-list");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const response = await axios.post(`${baseUrl}/api/categories/add`, {
        category_name: categoryName.trim(),
      });
      setCategoryName("");
      setCategories([...categories, { category_name: response.data.category_name }]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="addblogs-parent">
      <Dashboard />
      <div className="right">
        <h1>Edit Blog</h1>
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
                />{" "}
                <br />
                <div className="d-flex l text-center">
                  <label className="imagel">Image:</label>
                  <input
                    className="cf"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {blog.banner_image_url && !selectedFile && (
                    <img
                      src={blog.banner_image_url}
                      alt="Current Banner"
                      style={{ height: "20px", width: "20px", marginLeft: "10px" }}
                    />
                  )}
                </div>
                <div className="d-flex">
                  <label htmlFor="shortDescription">Short Description</label>{" "}
                  <br />
                  <input
                    id="shortDescription"
                    type="text"
                    placeholder="Enter short description"
                    className="input2"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />{" "}
                  <br />
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
                <h3>Categories</h3> <br />
                <div className="categories">
                  {categories.map((categoryItem) => (
                    <label key={categoryItem.id}>
                      <input
                        type="checkbox"
                        value={categoryItem.category_name}
                        checked={category.includes(categoryItem.category_name)}
                        onChange={handleCategoryChange}
                      />
                      {categoryItem.category_name}
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
            <div className="b-form" >
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
                style={{height:'70%'}}
              />
            </div>





          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlogs;
