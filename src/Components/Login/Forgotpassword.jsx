import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = "http://localhost:5000";

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${baseUrl}/api/forgot-password/send-otp`, { email });
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${baseUrl}/api/forgot-password/verify-otp`, { email, otp });
      setStep(3);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${baseUrl}/api/forgot-password/reset-password`, { email, newPassword });
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep(1);
      alert("Password reset successful!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="forgot-pwd-parent">
      <div id="forgot-password-container">
      <h2 id="forgot-password-title">Forgot Password</h2>
      {error && <p id="error-message">{error}</p>}

      {step === 1 && (
        <form id="email-form" onSubmit={handleSubmitEmail}>
          <label htmlFor="email-input">Email:</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button id="send-otp-button" type="submit" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form id="otp-form" onSubmit={handleSubmitOtp}>
          <label htmlFor="otp-input">OTP:</label>
          <input
            id="otp-input"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button id="verify-otp-button" type="submit" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form id="new-password-form" onSubmit={handleSubmitNewPassword}>
          <label htmlFor="new-password-input">New Password:</label>
          <input
            id="new-password-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm-password-input">Confirm Password:</label>
          <input
            id="confirm-password-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button id="reset-password-button" type="submit" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Reset Password"}
          </button>
        </form>
      )}
    </div>
    </div>
  );
};

export default ForgotPassword;