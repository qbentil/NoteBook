import Category from '../models/category.js';
import User from '../models/user.js';
import category from '../models/category.js';
import createError from '../util/Error.js';
import mongoose from 'mongoose';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            message: "These are all the categories displayed.",
            data: categories,
            count: categories.length
        })
    }
    catch (error) {
        next(error)
    }
}

export const getCategoryById = async (req, res, next) => {

    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        const categoryAggregate = await Category.aggregate([
            { 
                $match: { _id: mongoose.Types.ObjectId(categoryId) } 
            },
            { 
                $lookup: {
                from: 'users',
                localField: 'writtenBy',
                foreignField: '_id',
                as: 'user' 
                } 
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    writtenBy: "$user._id",
                    fullname: {
                        $concat: ["$user.firstName", " ", "$user.lastName"]
                    },
                    email: "$user.email"
                }
            }
        ])
        res.status(200).json({
            success: true, 
            message: "Category found successfully",
            category: categoryAggregate[0]
        })
    }
    catch (error) {
        next(error);
    }
}

export const createCategory = async (req, res, next) => {
    const { title, description } = req.body;
    const { id } = req.user;
    try {
        const existingCategory = await Category.findOne({ title })
        if (existingCategory) {
            return next(createError("Category already exists", 400))
        }
        const category = new Category({
            title: title,
            description: description,
            writtenBy: id
        })
        await category.save();
        const user = await User.findById(id);
        user.categories.push(category._id);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: category
        })
    }
    catch (error) {
        next (error)
    }
}

export const updateCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const { id } = req.user;
    const { title, description } = req.body;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        if (category.writtenBy.toString() !== id) {
            return next(createError("User not authorized", 403))
        }
        category.title = title;
        category.description = description;
        await category.save();
        res.status(200).json({
            success: true, 
            message: "Category updated successfully",
            category: category
        })
    }
    catch (error) {
        next (error)
    }
}

export const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const { id } = req.user;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(`Category not found with id ${categoryId}`, 404));
        }
        if (category.writtenBy.toString() !== id) {
            return next(createError("User not authorized", 403))
        }
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        const user = await User.findById(id);
        user.categories.pull(category._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category: deletedCategory
        })
    }
    catch (error) {
        next (error)
    }
}