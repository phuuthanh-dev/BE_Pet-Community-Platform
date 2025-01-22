const { OK } = require('../configs/response.config')
const { DONATION_MESSAGE } = require('../constants/messages')
const donationService = require('../services/donation.service')
const catchAsync = require('../utils/catchAsync')

class DonationController {
  getTop5Donate = catchAsync(async (req, res) => {
    const topDonate = await donationService.getTop5Donate()
    return OK(res, DONATION_MESSAGE.TOP_5_DONATE_FETCHED_SUCCESSFULLY, topDonate)
  })
}

module.exports = new DonationController()
