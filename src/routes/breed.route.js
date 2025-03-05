const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../middlewares/multer.js')
const { createBreed, getBreeds } = require('../controllers/breed.controller.js')
const checkRole = require('../middlewares/checkRole.js')
const { ROLE } = require('../constants/enums.js')

const router = express.Router()

router.route('/').post(isAuthenticated, checkRole(ROLE.SERVICE_STAFF), upload.single('image'), createBreed)
router.route('/').get(getBreeds)

module.exports = router
