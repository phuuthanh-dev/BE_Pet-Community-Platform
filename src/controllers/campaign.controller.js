const catchAsync = require('../utils/catchAsync')
const { OK, CREATED } = require('../configs/response.config')
const { CAMPAIGN_MESSAGE } = require('../constants/messages')
const campaignService = require('../services/campaign.service')

class CampaignController {
  createCampaign = catchAsync(async (req, res) => {
    const user = req.id
    const { title, description, startDate, endDate, targetAmount, image } = req.body

    const campaign = await campaignService.createCampaign(
      title,
      description,
      startDate,
      endDate,
      targetAmount,
      image,
      user
    )
    return CREATED(res, CAMPAIGN_MESSAGE.CAMPAIGN_CREATED_SUCCESSFULLY, campaign)
  })
  currentCampaign = catchAsync(async (req, res) => {
    const campaign = await campaignService.getCurrentCampaign()
    return OK(res, CAMPAIGN_MESSAGE.GET_CURRENT_CAMPAIGN_SUCCESSFULLY, campaign)
  })
}

module.exports = new CampaignController()
