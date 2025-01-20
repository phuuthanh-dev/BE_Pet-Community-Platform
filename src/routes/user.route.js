const express = require('express');
const multer = require('multer');
const {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers
} = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

module.exports = router;
