import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./apilist.css";
import Dashboard from "../Dashboard/Dashboard";
import { baseUrl } from "../Urls";
import axios from "axios";
import Swal from 'sweetalert2';
import { TrashFill, PencilSquare } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const handleDeleteClick = async (id) => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/docs/${id}`); // Send delete request using the correct ID
        setApiDocs(apiDocs.filter((doc) => doc.api_id !== id)); // Remove the item from the state
                toast.success(<h5 style={{ fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>API Deleted successfully</h5>);
      } catch (error) {
        console.error("Error deleting API documentation:", error);
        Swal.fire(
          'Error!',
          'Failed to delete API documentation. Please try again.',
          'error'
        );
      }
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
        <div className="main-table">
          <header className="header">
            <h1>API Documentation List</h1>
          </header>
          <div className="actions-container">
            <input
              type="text"
              placeholder="Search by Title or Link..."
              className="search-box"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Link to="/users/add-api" className="add-user-btn">
              + Add New API
            </Link>
          </div>
          <div className="user-table-container">
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
                          onClick={() => handleEdit(doc.api_id)}
                        >
                          <PencilSquare className="edit" />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteClick(doc.api_id)}
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
        <ToastContainer /></div>
    </div>
  );
};

export default ApiList;
