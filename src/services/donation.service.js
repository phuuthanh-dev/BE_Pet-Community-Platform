const { StatusCodes } = require('http-status-codes')
const Campaign = require('../models/campaign.model')
const Donation = require('../models/donation.model')
const { CAMPAIGN_MESSAGE, TRANSACTION_MESSAGE } = require('../constants/messages')
const ErrorWithStatus = require('../utils/errorWithStatus')
const { TRANSACTION_STATUS } = require('../constants/enums')

class DonationService {
  updateDonationStatus = async (orderCode, paymentData) => {
    const donation = await Donation.findOne({ code: orderCode })
    if (!donation) {
      throw new ErrorWithStatus({
        status: StatusCodes.NOT_FOUND,
        message: TRANSACTION_MESSAGE.TRANSACTION_NOT_FOUND
      })
    }

    donation.status = TRANSACTION_STATUS.COMPLETED
    donation.counterAccountName = paymentData.counterAccountName
    donation.counterAccountNumber = paymentData.counterAccountNumber
    donation.transactionDateTime = paymentData.transactionDateTime
    await donation.save()

    const campaign = await Campaign.findById(donation.campaign)
    if (!campaign) {
      throw new ErrorWithStatus({
        status: StatusCodes.NOT_FOUND,
        message: CAMPAIGN_MESSAGE.CAMPAIGN_NOT_FOUND
      })
    }

    campaign.currentAmount += donation.amount
    await campaign.save()

    return { donation, campaign }
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
      {
        $match: {
          campaign: campaign._id,
          status: TRANSACTION_STATUS.COMPLETED
        }
      },
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
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userId'] } } }, { $project: { password: 0 } }],
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ])
    return topDonate
  }
}

module.exports = new DonationService()
