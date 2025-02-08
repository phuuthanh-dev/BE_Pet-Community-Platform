const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const { getNotifications } = require('../controllers/notification.controller.js')

const router = express.Router()

router.route('/all').get(isAuthenticated, getNotifications)

module.exports = router
