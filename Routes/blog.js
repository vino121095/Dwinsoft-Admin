const express = require("express");
const { createBlog, upload, getBlogs, getIdBlogs, updateBlog ,deleteBlog} = require("../Controllers/blog");

const router = express.Router();

// Route to create a blog
router.post("/blog", upload, createBlog);

// Route to get all blogs
router.get("/blog", getBlogs);

router.get("/blog/:id", getIdBlogs)

// Route to update a blog
router.put("/blog/update/:id", upload, updateBlog);
router.delete("/blog/:id", deleteBlog);

module.exports = router;
