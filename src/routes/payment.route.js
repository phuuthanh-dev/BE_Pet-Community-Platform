const express = require('express')
const {
  createPaymentLink,
  receiveHook
} = require('../controllers/payment.controller.js')

const router = express.Router()

router.route('/create-payment-link').post(createPaymentLink)
router.route('/receive-hook').post(receiveHook)

module.exports = router
