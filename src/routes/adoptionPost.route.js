const express = require('express')
const multer = require('multer')
const { getAllPost, addNewPost, updatePost } = require('../controllers/adoptionPost.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const router = express.Router()

router.route('/').post(isAuthenticated, upload.array('media'), addNewPost)
router.route('/:id').put(isAuthenticated, upload.array('media'), updatePost)
router.route('/all').get(isAuthenticated, getAllPost)

module.exports = router
