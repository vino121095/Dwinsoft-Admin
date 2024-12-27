import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import "./addblogs.css";
import { useParams, useNavigate } from "react-router-dom";


const Addblogs = () => {
  const [title, setTitle] = useState(""); // State to manage title
  const [shortDescription, setShortDescription] = useState(""); // State for short description
  const [description, setDescription] = useState(""); // State for description
  const [selectedFile, setSelectedFile] = useState(null); // State for banner image upload
  const [category, setCategory] = useState([]); // State for category selection
  const [categoryName, setCategoryName] = useState(""); // State for new category input
  const [categories, setCategories] = useState([]); // State for fetched categories
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${baseUrl}/api/categories/list`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  // Handle category checkbox change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategory(prev => prev.includes(value) ? prev.filter(cat => cat !== value) : [...prev, value]);
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!categoryName.trim()) return; // Check for empty input

    try {
      const response = await axios.post(`${baseUrl}/api/categories/add`, {
        category_name: categoryName.trim(),
      });

      console.log(response.data); // Handle successful response
      setCategoryName(""); // Reset category input
      setCategories([...categories, { category_name: response.data.category_name }]); // Update categories with new category
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", shortDescription);
    formData.append("description", description);
    formData.append("category", category); // Send the category array directly (no JSON.stringify)

    if (selectedFile) {
      formData.append("bannerImage", selectedFile); // Attach the banner file
    }
    console.log("Form data to be sent:", {
      title,
      short_desc: shortDescription,
      description,
      category,
      bannerImage: selectedFile,
    });
    try {
      const response = await axios.post(`${baseUrl}/api/blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Blog created successfully:", response.data);
      alert("Blog created successfully");
      navigate("/blogs/blog-list");
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to create blog. Please try again.");
    }
  };

  // Handle file changes for image uploads
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
 

  return (
    <div className="addblogs-parent">
      <Dashboard />
      <div className="right">
        <h1>Add Blog</h1>
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
          </div>
          <div className="right">
            <div className="right-form">
            <div className="form-child">  <h3>Categories</h3>
              <div className="categories">
              {categories.map(category => (
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
              </div></div>
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
      </div>
    </div>
  );
};

export default Addblogs;
