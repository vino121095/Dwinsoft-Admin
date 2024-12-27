import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";
import "./updateuser.css";
import Dashboard from "../Dashboard/Dashboard";
import { baseUrl } from "../Urls";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate(); // For navigation after successful update

  // Fetch all users and filter by id
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user`); // Fetch all users
        const users = response.data; // List of users from backend

        // Find the user by ID
        const user = users.find((user) => user.id === parseInt(id, 10)); // Ensure type match for comparison

        if (user) {
          // Set the fetched user's data into the form state
          setFormData({
            userName: user.userName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            password: "", // Leave password empty for security
          });
        } else {
          alert("User not found!");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch user data. Please try again.");
      }
    };

    fetchUsers();
  }, [id]); // Dependency ensures this runs when `id` changes

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the user data using the PUT request
      const response = await axios.put(`${baseUrl}/api/user/update/${id}`, formData);
      console.log("Response:", response.data);
      alert("User updated successfully!");
      navigate("/users/user-list"); // Navigate to the user list page after updating
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="add-user-container">
      <Dashboard />
      <main className="main-content">
        <header className="header">
          <h1>Edit User</h1>
        </header>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name *</label>
            <input
              type="text"
              id="userName"
              placeholder="Enter Your User Name"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email ID *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Enter Your Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Enter New Password"
              value={formData.password}
              onChange={handleInputChange}
             
            />
          </div>
          <button type="submit" className="btn">
            Update <PencilSquare className="edit" />
          </button>
        </form>
        <footer className="footer">
          <p>© 2024. All rights reserved by Dwinsoft Technologies India Pvt Ltd.</p>
        </footer>
      </main>
    </div>
  );
};

export default UpdateUser;
