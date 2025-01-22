const mongoose = require('mongoose')
const { TRANSACTION_STATUS } = require('../constants/enums')

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    paymentUrl: { type: String, default: '' },
    counterAccountName: { type: String, default: '' },
    counterAccountNumber: { type: String, default: '' },
    transactionDateTime: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
      required: true
    }
  },
  { timestamps: true }
)
const Donation = mongoose.model('Donation', donationSchema)
module.exports = Donation
