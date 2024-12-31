import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import { useParams, useNavigate } from "react-router-dom";
import "./addblogs.css";

const UpdateBlogs = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState([]);
  // const [newCategory, setNewCategory] = useState("");
  const [blog, setBlog] = useState(null);

  const { id } = useParams();
  const [categoryName, setCategoryName] = useState(""); // State for new category input
  const [categories, setCategories] = useState([]); // State for fetched categories
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blog`);
        const blogData = response.data;

        const blogToUpdate = blogData.find((b) => b.id === parseInt(id));
        console.log(blogToUpdate);
        if (blogToUpdate) {
          setBlog(blogToUpdate);
          setTitle(blogToUpdate.title);
          setShortDescription(blogToUpdate.short_desc);
          setDescription(blogToUpdate.description);
          // Ensure category is always set as an array
          setCategory(Array.isArray(blogToUpdate.category) ? blogToUpdate.category : []);
        } else {
          console.error("Blog not found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", shortDescription);
    formData.append("description", description);

    // Ensure category is an array before calling .join() with a space
    const categoryData = Array.isArray(category) ? category.join(' ') : '';
    formData.append("category", categoryData);

    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }

    // Log the values before sending them to the backend
    console.log("Updated Blog Data:");
    console.log("Title:", title);
    console.log("Short Description:", shortDescription);
    console.log("Description:", description);
    console.log("Categories:", categoryData);
    console.log("Selected File:", selectedFile);

    try {
      const response = await axios.put(`${baseUrl}/api/blog/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Blog updated successfully:", response.data);
      alert("Blog updated successfully");
      navigate("/blogs/blog-list");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

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
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

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

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

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
      </div>
    </div>
  );
};

export default UpdateBlogs;
