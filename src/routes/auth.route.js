const express = require('express')
const { register, login, logout, sendVerifyEmail, verifyEmail, verifyForgotPassword, resetPassword } = require('../controllers/auth.controller.js')

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/verify-email').post(verifyEmail)
router.route('/send-verify-email').post(sendVerifyEmail)
router.route('/verify-forgot-password').post(verifyForgotPassword)
router.route('/reset-password').post(resetPassword)

module.exports = router
