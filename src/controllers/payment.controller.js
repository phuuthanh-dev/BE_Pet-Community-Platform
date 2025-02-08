const PayOS = require('@payos/node')
const crypto = require('crypto')
const catchAsync = require('../utils/catchAsync')
const donationService = require('../services/donation.service')
const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_CLIENT_SECRET, process.env.CHECK_SUM_KEY)
const { TRANSACTION_STATUS } = require('../constants/enums')
const { OK } = require('../configs/response.config')
const { TRANSACTION_MESSAGE } = require('../constants/messages')
const { StatusCodes } = require('http-status-codes')
const ErrorWithStatus = require('../utils/errorWithStatus')
const Donation = require('../models/donation.model')

class PaymentController {
  createPaymentLinkMember = catchAsync(async (req, res) => {
    const { amount, description, campaignId, returnUrl, cancelUrl } = req.body

    const userId = req.id
    const order = {
      amount: parseInt(amount),
      description: description || 'Ủng hộ chiến dịch',
      orderCode: crypto.randomInt(100000, 999999),
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutes from now in seconds
    }
    const paymentLink = await payos.createPaymentLink(order)

    await Donation.create({
      user: userId,
      campaign: campaignId,
      amount: order.amount,
      description: order.description,
      code: order.orderCode,
      paymentUrl: paymentLink.checkoutUrl
    })

    res.json({ paymentLink })
  })

  cancelPayment = catchAsync(async (req, res) => {
    const { orderCode } = req.body
    const donation = await Donation.findOne({ code: orderCode })
    if (!donation) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: TRANSACTION_MESSAGE.TRANSACTION_NOT_FOUND })
    }
    if (donation.status === TRANSACTION_STATUS.CANCELLED) {
      throw new ErrorWithStatus({
        status: StatusCodes.BAD_REQUEST,
        message: TRANSACTION_MESSAGE.TRANSACTION_ALREADY_CANCELLED
      })
    }
    if (donation.status === TRANSACTION_STATUS.COMPLETED) {
      throw new ErrorWithStatus({
        status: StatusCodes.BAD_REQUEST,
        message: TRANSACTION_MESSAGE.TRANSACTION_ALREADY_COMPLETED
      })
    }
    const cancelPaymentLink = await payos.cancelPaymentLink(orderCode, 'User cancel payment')
    if (!cancelPaymentLink) {
      throw new ErrorWithStatus({
        status: StatusCodes.BAD_REQUEST,
        message: TRANSACTION_MESSAGE.TRANSACTION_CANCEL_FAILED
      })
    }
    if (cancelPaymentLink.status === 'CANCELLED') {
      donation.status = TRANSACTION_STATUS.CANCELLED
      await donation.save()
    }
    OK(res, TRANSACTION_MESSAGE.TRANSACTION_CANCELLED_SUCCESSFULLY, cancelPaymentLink)
  })

  receiveHook = catchAsync(async (req, res) => {
    const webhookData = payos.verifyPaymentWebhookData(req.body)
    if (webhookData.code === '00' && webhookData.desc === 'success') {
      await donationService.updateDonationStatus(webhookData.orderCode, webhookData)
    }
    res.json({ message: 'Webhook processed successfully' })
  })
}

module.exports = new PaymentController()
