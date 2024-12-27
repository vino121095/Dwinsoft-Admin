const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Blog = require("../Models/blogs"); // Import Blog model


// Cloudinary Configuration
cloudinary.config({
  cloud_name: "ddapwn5l5",
  api_key: "955737422864725",
  api_secret: "MHAhDfKWk2vH4raKrvKnVABm3ZA",
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Invalid file type. Only images are allowed."));
  },
}).fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "descriptionImage", maxCount: 1 },
]);

const createBlog = async (req, res) => {
  try {
    const { title, short_desc, description, category, status = "Draft" } = req.body;
    let banner_image_url = null;
 

    if (req.files.bannerImage) {
      const result = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      banner_image_url = result.secure_url;
    }
   


console.log(title,
  short_desc,
  description,
  category,
  banner_image_url,
 
  status)

    const newBlog = await Blog.create({
      title,
      short_desc,
      description,
      category,
      banner_image_url,
    
      status,
    });

    if (req.files.bannerImage) fs.unlinkSync(req.files.bannerImage[0].path);
   

    res.status(200).json({ message: "Blog added successfully", newBlog });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Get Blogs Controller
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: ["id", "title", "short_desc", "description", "category", "banner_image_url", "description_image_url", "status", "createdAt"], // Include description_image_url
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getIdBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog by ID
    const blog = await Blog.findByPk(id, {
      attributes: ["id", "title", "short_desc", "description", "category", "banner_image_url", "description_image_url", "status", "createdAt"],
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Blog Controller
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, short_desc, description, category, status } = req.body;
    let banner_image_url = null;
    let description_image_url = null;

    // Find the blog by ID
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Log received data before updating the blog
    console.log("Received data for updating blog:");
    console.log("Blog ID:", id);
    console.log("Title:", title);
    console.log("Short Description:", short_desc);
    console.log("Description:", description);
    console.log("Categories:", category);
    console.log("Status:", status);

    // Upload new banner image if provided
    if (req.files && req.files.bannerImage) {
      const result = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      banner_image_url = result.secure_url;

      // Delete the previous banner image (optional if stored in Cloudinary)
      if (blog.banner_image_url) {
        const publicId = blog.banner_image_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      fs.unlinkSync(req.files.bannerImage[0].path);
    } else {
      banner_image_url = blog.banner_image_url; // Keep the old banner image URL
    }

    // Upload new description image if provided
    if (req.files && req.files.descriptionImage) {
      const result = await cloudinary.uploader.upload(req.files.descriptionImage[0].path);
      description_image_url = result.secure_url;

      // Delete the previous description image (optional if stored in Cloudinary)
      if (blog.description_image_url) {
        const publicId = blog.description_image_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      fs.unlinkSync(req.files.descriptionImage[0].path);
    } else {
      description_image_url = blog.description_image_url; // Keep the old description image URL
    }

    // Ensure category is a string (only use the first category if it's an array)
    let categoryString = '';
    if (category) {
      if (Array.isArray(category)) {
        categoryString = category[0]; // Taking the first category in case of multiple selections
      } else {
        categoryString = category; // If it's already a single category string
      }
    }

    // Update the blog in the database
    await blog.update({
      title,
      short_desc,
      description,
      category: categoryString,  // Store category as a single string
      banner_image_url,
      description_image_url,
      status,
    });

    console.log("BLOG UPDATED:", blog);
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Other controller methods...

// Delete Blog Controller
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog by ID
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Delete the blog's banner and description images from Cloudinary
    if (blog.banner_image_url) {
      const publicId = blog.banner_image_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    if (blog.description_image_url) {
      const publicId = blog.description_image_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the blog from the database
    await blog.destroy();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Other controller methods...

module.exports = { createBlog, upload, getBlogs, getIdBlogs, updateBlog, deleteBlog };
