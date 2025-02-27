const express = require('express')
const multer = require('multer')
const { getAllPost, addNewPost } = require('../controllers/adoptionPost.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const router = express.Router()

router.route('/all').get(isAuthenticated, getAllPost)
router.route('/addpost').post(isAuthenticated, upload.array('media'), addNewPost)

module.exports = router
