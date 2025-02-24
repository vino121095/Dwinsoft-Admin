const User = require("../Models/user"); // Assuming you have a User model
const nodemailer = require("nodemailer"); // For sending emails
const bcrypt = require("bcryptjs"); // For password hashing

// In-memory store for OTPs
const otpStore = {};

// Generate and send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists (optional, if you still want to validate the email)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "No mail id found" });
    }

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to in-memory store
    otpStore[email] = otp;
    console.log("OTP stored in memory:", otpStore);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dwinsoftsalem@gmail.com", // Replace with your Gmail address
        pass: "vlzl jyjj yucp ipck", // Replace with your Gmail password or app password
      },
    });

    // Send OTP via email
    const mailOptions = {
      from: "youremail@gmail.com", // Replace with your Gmail address
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  console.log("verifyOtp controller function called");
  console.log("Email from request:", email);
  console.log("OTP from request:", otp);

  try {
    // Check if OTP exists in memory for the given email
    const storedOtp = otpStore[email];
    console.log("Stored OTP in memory:", storedOtp);

    if (!storedOtp) {
      console.log("No OTP found for this email");
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    // Check if OTP matches
    if (storedOtp !== otp) {
      console.log("OTP does not match");
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Clear OTP from memory after successful verification
    delete otpStore[email];
    console.log("OTP verified successfully and cleared from memory");

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp function:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    console.log("Resetting password for email:", email);
    console.log("New password received:", newPassword);
  
    // Validate the required fields
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required" });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
  
      // Check if the user exists
      if (!user) {
        console.log("User not found for email:", email);
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      console.log("User found:", user);
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
      console.log("New password hashed successfully");
  
      // Update the user's password
      const updatedUser = await user.update({
        password: hashedPassword, // Update the password
      });
  
      console.log("Password updated successfully for user:", email);
  
      // Return success response (excluding password for security reasons)
      const { password: _, ...userData } = updatedUser.dataValues;
      res.status(200).json({ success: true, message: "Password reset successfully", userData });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ success: false, message: "Failed to reset password: " + error.message });
    }
  };
module.exports = { sendOtp, verifyOtp, resetPassword };