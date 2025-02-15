const express = require('express')
const { getAdminDashboard, manageUsers } = require('../controllers/admin.controller.js')

const router = express.Router()

// Route to get admin dashboard
router.route('/dashboard').get(getAdminDashboard)

// Route to manage users
router.route('/users').post(manageUsers)

module.exports = router
