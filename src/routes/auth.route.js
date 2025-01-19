const express = require('express')
const { register, login, logout, refreshToken } = require('../controllers/auth.controller.js')

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/refresh-token').post(refreshToken)

module.exports = router
