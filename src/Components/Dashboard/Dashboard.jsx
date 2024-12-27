import './dashboard.css'; // Import the external CSS
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import DwinLogo from "../../assets/dwinsoftLogo_dark.png";
import { baseUrl } from "../Urls";
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const refreshPage = () => {
    window.location.reload(); // Refresh the current page
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Refresh the page after logout (optional, if needed)
    window.location.reload();

    // Redirect to the homepage after logout
    navigate('/');
  };

  useEffect(() => {
    // Check if the token is in localStorage
    const token = localStorage.getItem('token');
    
    // If no token is found, navigate to the homepage
    if (!token) {
      navigate('/');
    }
  }, [navigate]); // Runs on page refresh or mount



  return (
    <div className='dash-parent'>
      <div className="sidebar">
        <div>
        
          <a href="#" onClick={refreshPage}>
            <img src={DwinLogo} alt="Dwinsoft Logo" />
          </a>
          <ul>
            <li style={{transition:"none"}}>
              <Link to="/blogs/blog-list">Blogs</Link> 
            </li>
            <li>
              <Link to="/users/api-list">Api</Link>
            </li>
            <li>
              <Link to="/users/user-list">Users</Link> 
            </li>
            <li>
              <a href="#" onClick={handleLogout} className='logout' >LogOut</a> 
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
