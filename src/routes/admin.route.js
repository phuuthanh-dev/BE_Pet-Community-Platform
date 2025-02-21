const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const adminController = require('../controllers/admin.controller.js')
const router = express.Router()

router.get('/stats', isAuthenticated, adminController.getStats)
router.get('/staff', isAuthenticated, adminController.getAllStaffs)

module.exports = router
