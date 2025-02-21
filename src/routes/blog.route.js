const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blog.controller')
const isAuthenticated = require('../middlewares/isAuthenticated')
const checkRole = require('../middlewares/checkRole')
const { ROLE } = require('../constants/enums')

const router = express.Router()

router.post('/create', isAuthenticated, checkRole(ROLE.FORUM_STAFF), upload.single('thumbnail'), createBlog)
router.get('/all', getAllBlogs)
router.get('/:id', getBlogById)
router.put('/:id', isAuthenticated, checkRole(ROLE.FORUM_STAFF), upload.single('thumbnail'), updateBlog)
router.delete('/:id', isAuthenticated, checkRole(ROLE.FORUM_STAFF), deleteBlog)

module.exports = router
