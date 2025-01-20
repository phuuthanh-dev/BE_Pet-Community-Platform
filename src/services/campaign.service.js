const Campaign = require('../models/campaign.model')

class CampaignService {
  createCampaign = async (title, description, startDate, endDate, targetAmount, image, user) => {
    const campaign = await Campaign.create({ title, description, startDate, endDate, targetAmount, image, user })
    return campaign
  }
  getCurrentCampaign = async () => {
    const currentDate = new Date()
    const campaign = await Campaign.findOne({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    return campaign
  }
}

module.exports = new CampaignService()
