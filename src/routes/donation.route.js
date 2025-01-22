const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const { getTop5Donate } = require('../controllers/donation.controller.js')

const router = express.Router()

router.route('/top-5').get(isAuthenticated, getTop5Donate)

module.exports = router
