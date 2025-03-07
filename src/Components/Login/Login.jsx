import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { baseUrl } from "../Urls";
import DwinLogo from "../../assets/dwinsoftLogo_dark.png";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!", { duration: 1000 });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div id="login-container">
      <div id="login-box">
        <div id="logo-container">
          <img src={DwinLogo} alt="Dwinsoft Logo" id="logo" />
        </div>
        <h2 id="login-title">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div id="email-group">
            <label>Email ID</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div id="password-group">
            <label>Password</label>
            <div id="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {showPassword ? (
                <FaEyeSlash id="eye-icon" onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <FaEye id="eye-icon" onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
          </div>
          <div id="forgot-pwd">
            <Link to="/forgotpassword" id="forgot-link">Forgot password?</Link>
          </div>
          <button type="submit" id="login-btn">Log In</button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
