const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    image: { type: String, required: true }
  },
  { timestamps: true }
)
const Campaign = mongoose.model('Campaign', campaignSchema)
module.exports = Campaign
