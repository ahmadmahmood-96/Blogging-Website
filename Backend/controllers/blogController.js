const Blog = require("../models/blog");

exports.addBlog = async (req, res) => {
    try {
        const {
            createdBy,
            title,
            category,
            content,
            image,
            public
        } = req.body;

        const blog = new Blog({
            createdBy,
            title,
            category,
            content,
            image,
            public
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

// Controller to like a blog
exports.likeBlog = async (req, res) => {
    try {
        const {
            blogId
        } = req.body;
        const userId = req.user._id; // Assuming user id is available in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Add user to likes if not already liked
        if (!blog.likes.includes(userId)) {
            blog.likes.push(userId);
            await blog.save();
        }

        res.status(200).json({
            likes: blog.likes
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to like the blog"
        });
    }
};

// Controller to comment on a blog
exports.commentBlog = async (req, res) => {
    try {
        const {
            blogId,
            comment
        } = req.body;
        const userId = req.user._id; // Assuming user id is available in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Add the comment to the blog's comments
        blog.comments.push({
            user: userId,
            comment
        });
        await blog.save();

        // Populate user details for the response
        const populatedBlog = await Blog.findById(blogId).populate("comments.user");

        res.status(200).json({
            comments: populatedBlog.comments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to comment on the blog"
        });
    }
};

// Controller to get all blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            blogs
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blogs"
        });
    }
};