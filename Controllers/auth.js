const User = require('../Models/user'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Email:", email, "Password:", password);

  // Get the SECRET_KEY from environment variables
  const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey'; // fallback to 'mysecretkey' if not set

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Log the stored password for debugging
    console.log("Stored Password (hashed):", user.password);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log("Correct password"); // Log for correct password
      
      // Generate a JWT token
      const token = jwt.sign(
        { email: user.email, id: user.id }, // Include user ID in the payload for additional usage
        SECRET_KEY, 
        { expiresIn: '1d' } // Token expires in 1 day
      );

      // Set token in cookies
      res.cookie('token', token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });

      // Send response with token and user data
      res.json({ success: true, message: "Login successful", token, user });
    } else {
      console.log("Wrong password"); // Log for incorrect password
      res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { login };
