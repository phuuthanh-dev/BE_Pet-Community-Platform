const express = require('express')
const {
  createPaymentLinkMember,
  receiveHook,
  cancelPayment
} = require('../controllers/payment.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

const router = express.Router()

router.route('/member/create-payment-link').post(isAuthenticated, createPaymentLinkMember)
router.route('/cancel-payment-link').put(cancelPayment)
router.route('/receive-hook').post(receiveHook)

module.exports = router
