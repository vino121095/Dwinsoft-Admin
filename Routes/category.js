const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/category');

// Get all categories
router.get('/categories/list', categoryController.getAllCategories);

// Get a single category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Create a new category
router.post('/categories/add', categoryController.createCategory);

// Update a category by ID
router.put('/categories/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
