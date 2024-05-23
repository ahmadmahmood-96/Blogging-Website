const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [] // Default to an empty array
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comment: {
            type: String,
        },
        default: [] // Default to an empty array
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Base User model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;