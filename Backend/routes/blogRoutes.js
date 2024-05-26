const express = require('express');
const router = express.Router();
const blogController = require("../controllers/blogController")

router.post('/add-blog', blogController.addBlog);
router.post("/like-blog", blogController.likeBlog);
router.post("/comment-blog", blogController.commentBlog);
router.get("/get-blogs", blogController.getBlogs);

module.exports = router;