const express = require("express");
const router = express.Router();
const Blog = require("../model/Blog.js");
const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the extension
  },
});

const upload = multer({ storage });

// Create a new blog with optional file upload
router.post("/blogs", upload.single('file'), async (req, res) => {
  try {
    const { subject, blogHead, blogData } = req.body;
    const filePath = req.file ? req.file.path : null; // Get file path

    const newBlog = new Blog({ subject, blogHead, blogData, file: filePath });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get all blogs or blogs by subject
router.get("/blogs/:subject?", async (req, res) => {
  try {
    const subject = req.params.subject;
    const query = subject ? { subject } : {};
    const blogs = await Blog.find(query);
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete a blog by ID
router.delete("/blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json("Deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Update a specific blog by ID, including optional file upload
router.put("/blogs/:id", upload.single('file'), async (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedBlogData = req.body;

    // Handle file upload
    if (req.file) {
      updatedBlogData.file = req.file.path; // Update file path if a new file is uploaded
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
