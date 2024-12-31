import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./apilist.css";
import Dashboard from "../Dashboard/Dashboard";
import { baseUrl } from "../Urls";
import axios from "axios";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";

const ApiList = () => {
  const [apiDocs, setApiDocs] = useState([]); // State to store API documentation
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    // Fetch API data when the component mounts
    const fetchApiDocs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/docs`); // Fetch API docs
        setApiDocs(response.data); // Set the fetched data in state
      } catch (error) {
        console.error("Error fetching API documentation:", error);
      }
    };

    fetchApiDocs(); // Call the function to fetch API docs
  }, []);

  // Handle change in search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  // Delete API documentation
  const handleDelete = async (api_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/api/docs/${api_id}`); // Send delete request
      setApiDocs(apiDocs.filter((doc) => doc.api_id !== api_id)); // Remove the item from the state
      alert("API documentation deleted successfully.");
    } catch (error) {
      console.error("Error deleting API documentation:", error);
      alert("Failed to delete API documentation. Please try again.");
    }
  };

  // Handle edit button click
  const handleEdit = (api_id) => {
    navigate(`/users/update-api/${api_id}`); // Navigate to the edit page with the row id
  };

  // Filter API docs based on the search term
  const filteredApiDocs = apiDocs.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.link.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="main-container">
      <Dashboard />
      <div className="user-list">
        <header className="header">
          <h1>API Documentation List</h1>
        </header>
        <div className="main-table">
          <div className="actions-container">
            <input
              type="text"
              placeholder="Search by Title or Link..."
              className="search-box"
              value={searchTerm}
              onChange={handleSearchChange} // Handle search term change
            />
            <Link to="/users/add-api" className="add-user-btn">
              + Add New API
            </Link>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Title</th>
                <th>Link</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApiDocs.length > 0 ? (
                filteredApiDocs.map((doc, index) => (
                  <tr key={doc.api_id}>
                    {console.log(doc.api_id)}
                    <td>{index + 1}</td>
                    <td>{doc.title}</td>
                    <td>
                      <a href={doc.link} target="_blank" rel="noopener noreferrer">
                        {doc.link}
                      </a>
                    </td>
                    <td>
                      {doc.bannerImage ? (
                        <img
                          src={doc.bannerImage}
                          alt={doc.title}
                          className="api-image"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                     
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(doc.api_id)} // Trigger edit
                      >
                        <PencilSquare className="edit" />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(doc.api_id)}
                      >
                       <TrashFill className="trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No API documentation found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiList;
