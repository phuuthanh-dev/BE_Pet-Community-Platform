const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')
const { createDonation, getTop5Donate } = require('../controllers/donation.controller.js')

const router = express.Router()

router.route('/').post(isAuthenticated, createDonation)
router.route('/top-5').get(isAuthenticated, getTop5Donate)

module.exports = router
