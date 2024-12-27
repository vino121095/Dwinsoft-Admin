const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

// Define the Blog model
const Blog = sequelize.define("Blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.JSON, // Store categories as an array
    allowNull: false,
  },
  banner_image_url: { // Store the image URL instead of the binary data
    type: DataTypes.STRING,
    allowNull: true,
  },
  description_image_url: {
    type: DataTypes.STRING,
    allowNull: true,  // This can be NULL if the image is optional
  },
  
  status: {
    type: DataTypes.STRING,
    defaultValue: "Draft",
    allowNull: false,
  },
});

module.exports = Blog;
