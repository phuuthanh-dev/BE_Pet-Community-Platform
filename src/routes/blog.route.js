const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require('../controllers/blog.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

router.post('/create', isAuthenticated, upload.single('thumbnail'), createBlog);
router.get('/all', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', isAuthenticated, upload.single('thumbnail'), updateBlog);
router.delete('/:id', isAuthenticated, deleteBlog);

module.exports = router; 