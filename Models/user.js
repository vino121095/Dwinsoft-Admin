const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const User = sequelize.define('User', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure this field is not null
    unique: true, // Ensure the username is unique
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Email is also required
    unique: true, // Ensure the email is unique
    validate: {
      isEmail: true, // Validate that it's an email format
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure phone number is not null
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure password is not null
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure role is not null
    defaultValue: 'user', // Default value is 'user'
  },
});

module.exports = User;
