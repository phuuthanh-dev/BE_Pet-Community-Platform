const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')
const { createDonation } = require('../controllers/donation.controller.js')

const router = express.Router()

router.route('/').post(isAuthenticated, createDonation)

module.exports = router
