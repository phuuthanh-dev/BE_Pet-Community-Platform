const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getPostById,
  getUserPost,
  likePost
} = require('../controllers/post.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

const router = express.Router()

router.route('/addpost').post(isAuthenticated, upload.array('images'), addNewPost)
router.route('/all').get(isAuthenticated, getAllPost)
router.route('/userpost/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').put(isAuthenticated, likePost)
router.route('/:id/dislike').put(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost)
router.route('/:id/getpostbyid').get(isAuthenticated, getPostById)
router.route('/:id').delete(isAuthenticated, deletePost)
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost)

module.exports = router
