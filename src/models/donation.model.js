const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
)
const Donation = mongoose.model('Donation', donationSchema)
module.exports = Donation
