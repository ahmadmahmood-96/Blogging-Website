const express = require('express');
const router = express.Router();
const blogController = require("../controllers/blogController")
// Importing Verifying Token Middleware
const verifyToken = require("../middleware/verify");

router.post("/add-blog", verifyToken, blogController.addBlog);
router.post("/like-blog", blogController.likeBlog);
router.post("/comment-blog", blogController.commentBlog);
router.get("/get-blogs", blogController.getBlogs);
router.get("/get-blog/:id", blogController.getBlog);
router.get("/get-all-blogs/:id", blogController.getAllBlogs);
router.put("/hide-blog/:blogId", verifyToken, blogController.hideBlog);
router.put("/unhide-blog/:blogId", verifyToken, blogController.unhideBlog);
router.delete("/delete-blog/:blogId", verifyToken, blogController.deleteBlog);
router.put('/edit-blog/:blogId', verifyToken, blogController.editBlog);
router.get("/stats/:id", verifyToken, blogController.getDashboardStats);

module.exports = router;