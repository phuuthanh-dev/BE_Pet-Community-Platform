const { CREATED, OK } = require('../configs/response.config')
const { DONATION_MESSAGE } = require('../constants/messages')
const donationService = require('../services/donation.service')
const catchAsync = require('../utils/catchAsync')

class DonationController {
  createDonation = catchAsync(async (req, res) => {
    const { campaign, amount, message } = req.body
    const user = req.id
    const donation = await donationService.createDonation(user, campaign, amount, message)
    return CREATED(res, DONATION_MESSAGE.DONATION_CREATED_SUCCESSFULLY, donation)
  })
  getTop5Donate = catchAsync(async (req, res) => {
    const topDonate = await donationService.getTop5Donate()
    return OK(res, DONATION_MESSAGE.TOP_5_DONATE_FETCHED_SUCCESSFULLY, topDonate)
  })
}

module.exports = new DonationController()
