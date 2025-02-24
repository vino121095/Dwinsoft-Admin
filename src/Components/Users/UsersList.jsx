import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userslist.css";
import Dashboard from "../Dashboard/Dashboard";
import { baseUrl } from "../Urls"; // Make sure the baseUrl is correctly set to your backend API URL
import axios from "axios";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store the users
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Fetch users data when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user`); // Adjust the URL to match your API endpoint
        setUsers(response.data); // Set the fetched users in the state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array to run the effect only once when the component mounts

  // Handle change in search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) => {
    return (
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
    );
  });

  // Handle edit button click to navigate to edit page
  const handleEditClick = (id) => {
    navigate(`/users/edit-user/${id}`); // Navigate to the edit page with the user ID
  };

  // Handle delete button click
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        });
    
        if (result.isConfirmed) { {
      try {
        await axios.delete(`${baseUrl}/api/user/delete/${id}`); // Send DELETE request to backend
        alert("User deleted successfully!");

        // Update the UI by removing the deleted user
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
}};

  return (
    <div className="main-container">
      <Dashboard />
      <div className="user-list">
       
        <div className="main-table">
        <header className="header">
          <h1>User List</h1>
        </header>
          <div className="actions-container">
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone..."
              className="search-box"
              value={searchTerm}
              onChange={handleSearchChange} // Handle search term change
            />
            <Link to="/users/add-user" className="add-user-btn">
              + Add New User
            </Link>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditClick(user.id)} // Pass user ID to navigate
                      >
                        <PencilSquare className="edit" />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteClick(user.id)} // Pass user ID to delete
                      >
                        <TrashFill className="trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      <ToastContainer /> </div>
    </div>
  );
};

export default UserList;
