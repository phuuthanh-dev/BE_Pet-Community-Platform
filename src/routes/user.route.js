const express = require('express');
const multer = require('multer');
const {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  getProfileById,
  getChatUser
} = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.route('/:username/profile').get(isAuthenticated, getProfile);
router.route('/id/:id/profile').get(isAuthenticated, getProfileById);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow)
router.route('/chat-users').get(isAuthenticated, getChatUser)

module.exports = router;
