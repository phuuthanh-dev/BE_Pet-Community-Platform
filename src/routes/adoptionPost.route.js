const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const { getAllPost } = require('../controllers/adoptionPost.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

const router = express.Router()

router.route('/all').get(isAuthenticated, getAllPost)

module.exports = router
