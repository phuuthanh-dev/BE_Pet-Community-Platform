const PayOS = require('@payos/node');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_CLIENT_SECRET, process.env.CHECK_SUM_KEY);

class PaymentController {
    createPaymentLink = catchAsync(async (req, res) => {
        const { amount, description, orderCode, returnUrl, cancelUrl } = req.body
        const order = {
            amount: parseInt(amount),
            description: 'Thanh toan don hang',
            orderCode: crypto.randomInt(100000, 999999),
            returnUrl: `${process.env.URL}`,
            cancelUrl: `${process.env.URL}`
        }

        const paymentLink = await payos.createPaymentLink(order)

        res.json({ paymentLink })
    })

    receiveHook = catchAsync(async (req, res) => {
        const { body } = req
        console.log('Receive hook', body)
        res.json({ message: 'Received hook' })
    })
}

module.exports = new PaymentController()