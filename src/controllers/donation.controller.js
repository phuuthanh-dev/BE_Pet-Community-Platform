const { CREATED } = require('../configs/response.config')
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
}

module.exports = new DonationController()
