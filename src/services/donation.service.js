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
}

module.exports = new DonationService()
