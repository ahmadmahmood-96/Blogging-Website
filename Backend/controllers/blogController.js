const Blog = require("../models/blog");
const mongoose = require("mongoose");

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
            blogId,
            userId
        } = req.body;

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
            comment,
            userId
        } = req.body;
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

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({
            public: true
        }).populate("createdBy").populate("comments.user");
        res.status(200).json({
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blogs"
        });
    }
};

exports.getBlog = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const blog = await Blog.findById({
            _id: id
        }).populate("createdBy").populate("comments.user");
        res.status(200).json({
            blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blog"
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const blogs = await Blog.find({
            createdBy: id
        }).populate("createdBy").populate("comments.user");
        res.status(200).json({
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blogs"
        });
    }
};

exports.hideBlog = async (req, res) => {
    try {
        const {
            blogId
        } = req.params;
        const user = await Blog.findByIdAndUpdate(blogId, {
            public: false
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'Blog visibility is now private'
            });
        } else {
            return res.json({
                success: false,
                message: 'Blog not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.unhideBlog = async (req, res) => {
    try {
        const {
            blogId
        } = req.params;
        const user = await Blog.findByIdAndUpdate(blogId, {
            public: true
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'Blog visibility is now public'
            });
        } else {
            return res.json({
                success: false,
                message: 'Blog not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const {
            blogId
        } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({
                success: false,
                error: 'Blog not found'
            });
        }
        // Perform deletion in the database
        await Blog.findByIdAndDelete(blogId);

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

exports.editBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const updatedBlogData = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId, {
                $set: updatedBlogData
            }, {
                new: true
            }
        );
        if (!updatedBlog) {
            res.json({
                message: 'Blog not found'
            });
        } else res.status(201).json({
            message: 'Blog updated successfully'
        });
    } catch (error) {
        res.json({
            error: 'Error updating blog'
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // Fetch total counts
        const userId = req.params.id;
        const totalBlogs = await Blog.countDocuments({
            createdBy: userId
        });
        const totalLikes = await Blog.aggregate([{
            $match: {
                createdBy: mongoose.Types.ObjectId.createFromHexString(userId)
            }
        }, {
            $project: {
                likesCount: {
                    $size: '$likes'
                }
            }
        }, {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: "$likesCount"
                }
            }
        }]);

        const totalComments = await Blog.aggregate([{
                $match: {
                    createdBy: mongoose.Types.ObjectId.createFromHexString(userId)
                }
            }, {
                $project: {
                    commentsCount: {
                        $size: "$comments"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalComments: {
                        $sum: "$commentsCount"
                    }
                }
            }
        ]);

        // Fetch daily activity
        const dailyActivity = await Blog.aggregate([{
                $match: {
                    createdBy: mongoose.Types.ObjectId.createFromHexString(userId),
                    createdAt: {
                        $gte: new Date(new Date() - 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    blogs: {
                        $sum: 1
                    },
                    likes: {
                        $sum: {
                            $size: "$likes"
                        }
                    },
                    comments: {
                        $sum: {
                            $size: "$comments"
                        }
                    }
                }
            }
        ]);

        // Fetch monthly activity
        const monthlyActivity = await Blog.aggregate([{
            $match: {
                createdBy: mongoose.Types.ObjectId.createFromHexString(userId),
            }
        }, {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: "$createdAt"
                    }
                },
                blogs: {
                    $sum: 1
                },
                likes: {
                    $sum: {
                        $size: "$likes"
                    }
                },
                comments: {
                    $sum: {
                        $size: "$comments"
                    }
                }
            }
        }]);

        // Fetch yearly activity
        const yearlyActivity = await Blog.aggregate([{
                $match: {
                    createdBy: mongoose.Types.ObjectId.createFromHexString(userId),
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y",
                            date: "$createdAt"
                        }
                    },
                    blogs: {
                        $sum: 1
                    },
                    likes: {
                        $sum: {
                            $size: "$likes"
                        }
                    },
                    comments: {
                        $sum: {
                            $size: "$comments"
                        }
                    }
                }
            }
        ]);

        // Prepare the response data
        const response = {
            totalBlogs,
            totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0,
            totalComments: totalComments.length > 0 ? totalComments[0].totalComments : 0,
            daily: dailyActivity,
            monthly: monthlyActivity,
            yearly: yearlyActivity
        };
        res.status(200).json(response);
    } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });
    }
};