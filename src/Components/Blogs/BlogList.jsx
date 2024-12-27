import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogList.css";
import Dashboard from "../Dashboard/Dashboard";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../Urls";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";
import parse from "html-react-parser"; // Import the html-react-parser package

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blog`);
        console.log(response.data)
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleEditClick = (id) => navigate(`/users/update-user/${id}`);

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/blog/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-list-Parent">
      <Dashboard />
      <div className="blog-list-container">
        <header className="blog-list-header">
          <h1>Blog List</h1>
          <div className="actions-container">
            <input
              type="text"
              placeholder="Search by Title"
              className="search-box"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Link to="/blogs/add-blog" className="add-blog-btn">
            + Add New Blog
          </Link>
        </header>
        <table className="blog-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Title</th>
              <th>Banner Image</th>
              <th>Description Image</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog, index) => (
              <tr key={blog.id}>
                <td>{index + 1}</td>
                <td>{blog.title}</td>
                <td>
                  <img src={blog.banner_image_url} alt={blog.title} className="blog-image" />
                </td>
    
            
                <td className="parsed">{parse(blog.description.slice(0, 100))}...</td>

                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>{blog.status || "Unknown"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(blog.id)}>
                    <PencilSquare className="edit" />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(blog.id)}>
                    <TrashFill className="trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
