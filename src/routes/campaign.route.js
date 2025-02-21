const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')
const { createCampaign, currentCampaign } = require('../controllers/campaign.controller.js')
const checkRole = require('../middlewares/checkRole.js')
const { ROLE } = require('../constants/enums.js')

const router = express.Router()

router.route('/').post(isAuthenticated, checkRole(ROLE.ADMIN), createCampaign)
router.route('/current').get(isAuthenticated, currentCampaign)

module.exports = router
