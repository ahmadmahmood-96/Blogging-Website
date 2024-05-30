const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
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
    image: {
        type: String, // Base64 encoded string
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: [] // Default to an empty array
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        comment: {
            type: String,
        },
    }],
    views: {
        type: Number,
        default: 0
    },
    public: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Base User model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;