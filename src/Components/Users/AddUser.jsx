import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddUser.css";
import Dashboard from "../Dashboard/Dashboard";
import { baseUrl } from "../Urls";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    // Clear form fields to prevent autofill
    setFormData({
      userName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
  }, []); // Run this only once when the component mounts

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
      const response = await axios.post(`${baseUrl}/api/user`, formData);
      console.log("Response:", response.data);
      alert("User added successfully!");
      navigate("/users/user-list");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="add-user-container">
      <Dashboard />
      <main className="main-content">
        <header className="header">
          <h1>Add New User</h1>
        </header>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name *</label>
            <input
              type="text"
              id="userName"
              autoComplete="new-password"
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
              autoComplete="new-password"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="text"
              id="phoneNumber"
              autoComplete="new-password"
              placeholder="Enter Your Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group password-group">
            <label htmlFor="password">Password *</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                placeholder="Enter New Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="btn">
            Add New
          </button>
        </form>
        <footer className="footer">
          © 2024. All rights reserved by Dwinsoft Technologies India Pvt Ltd.
        </footer>
      </main>
    </div>
  );
};

export default AddUser;
