const express = require('express')
const {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
<<<<<<< HEAD
  logout
=======
  logout,
  refreshToken
>>>>>>> main
} = require('../controllers/user.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')

const router = express.Router()
router.route('/profile/:id').get(getProfile)
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile)
router.route('/suggested').get(isAuthenticated, getSuggestedUsers)
router.route('/refresh-token').get(isAuthenticated, refreshToken)
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow)

module.exports = router
