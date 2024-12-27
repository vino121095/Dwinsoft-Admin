const bcrypt = require('bcrypt');
const User = require("../Models/user");

const AddUser = async (req, res) => {
  const { userName, email, phoneNumber, password } = req.body;

  // Validate that required fields are present
  if (!userName || !phoneNumber || !password) {
    return res.status(400).json({ error: "userName, phoneNumber, and password are required" });
  }

  try {
    // Log the received data for debugging
    console.log("FromController", userName, phoneNumber, password);

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided data
    const user = await User.create({
      userName,
      email, // Email will be sent as it is, and can be used for login/registration
      phoneNumber,
      password: hashedPassword, // Store the hashed password for security
    });

    // Return success message
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Error adding user: " + error.message });
  }
};

const GetUser = async (req, res) => {
  const { userId, email } = req.params;

  // Check if userId or email is provided in the request
  if (!userId && !email) {
    try {
      // If neither is provided, fetch all users
      const users = await User.findAll(); // Retrieves all users from the database

      // Map through the users to remove the password field
      const userData = users.map(user => {
        const { password, ...userWithoutPassword } = user.dataValues;
        return userWithoutPassword;
      });

      // Return the list of users
      res.json(userData);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Error retrieving users: " + error.message });
    }
  } else {
    try {
      let user;

      // Search by userId or email
      if (userId) {
        user = await User.findOne({ where: { id: userId } });
      } else if (email) {
        user = await User.findOne({ where: { email } });
      }

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return user data (excluding password for security reasons)
      const { password, ...userData } = user.dataValues;
      res.json(userData);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Error retrieving user: " + error.message });
    }
  }
};

const UpdateUser = async (req, res) => {
  const { userName, email, phoneNumber, password } = req.body;
  const { id } = req.params; // Get user ID from URL parameters

  // Validate the required fields
  if (!userName || !phoneNumber) {
    return res.status(400).json({ error: "userName and phoneNumber are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password if provided (if password is not provided, it won't be changed)
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
    }

    // Update the user details
    const updatedUser = await user.update({
      userName,
      email: email || user.email, // If email is not provided, retain the old email
      phoneNumber,
      password: hashedPassword, // Update password if changed
    });

    // Return updated user data (excluding password for security reasons)
    const { password: _, ...userData } = updatedUser.dataValues;
    res.json({ message: "User updated successfully", userData });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user: " + error.message });
  }
};
const DeleteUser = async (req, res) => {
  const { id } = req.params; // Get user ID from URL parameters

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await user.destroy();

    // Return success message
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user: " + error.message });
  }
};

module.exports = { AddUser, GetUser, UpdateUser, DeleteUser};
