const Blog = require("../models/blog");

exports.addBlog = async (req, res) => {
    try {
        const {
            createdBy,
            title,
            category,
            content
        } = req.body;

        const blog = new Blog({
            createdBy,
            title,
            category,
            content
        });

        await blog.save();

        res.status(201).json({
            message: 'Blog added successfully'
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Blog can not be posted'
        });
    }
};