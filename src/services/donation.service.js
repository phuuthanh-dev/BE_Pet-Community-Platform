const { StatusCodes } = require('http-status-codes')
const Campaign = require('../models/campaign.model')
const Donation = require('../models/donation.model')
const { CAMPAIGN_MESSAGE } = require('../constants/messages')
const ErrorWithStatus = require('../utils/errorWithStatus')

class DonationService {
  createDonation = async (user, campaignId, amount, message) => {
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: CAMPAIGN_MESSAGE.CAMPAIGN_NOT_FOUND })
    }
    const donation = await Donation.create({ user, campaign, amount, message })
    campaign.currentAmount += amount
    await campaign.save()
    return donation
  }
  getTop5Donate = async () => {
    const currentDate = new Date()
    const campaign = await Campaign.findOne({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    if (!campaign) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: CAMPAIGN_MESSAGE.CAMPAIGN_NOT_FOUND })
    }
    const topDonate = await Donation.aggregate([
      { $match: { campaign: campaign._id } },
      {
        $group: {
          _id: '$user',
          totalAmount: { $sum: '$amount' },
          lastMessage: { $last: '$message' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { password: 0 } }
          ],
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ])
    return topDonate
  }
}

module.exports = new DonationService()
