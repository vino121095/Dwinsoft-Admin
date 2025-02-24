const express = require("express");
const {sendOtp, verifyOtp, resetPassword} = require("../Controllers/forgotpassword");

const router = express.Router();

// Send OTP
router.post("/forgot-password/send-otp", sendOtp);

// Verify OTP
router.post("/forgot-password/verify-otp", (req, res) => {
    console.log("verify-otp route called by frontend");
    console.log("Request body:", req.body);
    verifyOtp(req, res);
  });
// Reset Password
router.put("/forgot-password/reset-password", resetPassword);

module.exports = router;