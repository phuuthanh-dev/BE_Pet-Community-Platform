const express = require("express");
const { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const upload = require("../middlewares/multer.js");

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

module.exports = router;