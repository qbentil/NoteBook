import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controllers.js";

import Validator from '../Middleware/Validator.js';
import express from 'express';
import { validate } from 'express-validation';
import { verifyLogin } from "../Middleware/Verification.js";

const router = express.Router();

// @route   GET /categories
// @desc    Get all categories
// @access  Private

router.get('/', verifyLogin, getCategories);

// @route   GET /category/categoryId
// @desc    Get category
// @access  Private

router.get('/:categoryId', verifyLogin, getCategoryById);

// @route   POST /category
// @desc    Create category
// @access  Private

router.post('/', verifyLogin, Validator('category'), createCategory);

// @route   PUT /category/:id
// @desc    Update category
// @access  Private

router.put('/:categoryId', verifyLogin, Validator('category'), updateCategory);

// @route   DELETE /category/:categoryId
// @desc    Delete category
// @access  Private

router.delete('/:categoryId', verifyLogin, deleteCategory);

export default router;