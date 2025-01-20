const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')
const { createCampaign, currentCampaign } = require('../controllers/campaign.controller.js')

const router = express.Router()

router.route('/').post(isAuthenticated, createCampaign)
router.route('/current').get(isAuthenticated, currentCampaign)

module.exports = router
