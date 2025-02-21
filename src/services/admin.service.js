const User = require('../models/user.model') // Assuming you have a User model
const Donation = require('../models/donation.model') // Assuming you have a Donation model

class AdminService {
  getStats = async () => {
    try {
      const user = await User.countDocuments()

      const donationAggregation = await Donation.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' }, // Group by month
            total: { $sum: '$amount' } // Sum donations
          }
        },
        { $sort: { _id: 1 } } // Sort by month
      ])

      // Ensure all months (1-12) are represented
      const donations = Array.from({ length: 12 }, (_, index) => {
        const monthData = donationAggregation.find((d) => d._id === index + 1)
        return {
          month: new Date(2000, index, 1).toLocaleString('en-US', { month: 'long' }), // Convert to month name
          total: monthData ? monthData.total : 0
        }
      })

      return { user, donations }
    } catch (error) {
      console.error('Error in getStats:', error)
      throw new Error('Failed to fetch admin stats')
    }
  }

  getAllStaffs = async () => {
    try {
      const staffs = await User.find({ role: 'staff' })
      return staffs
    } catch (error) {
      console.error('Error in getAllStaffs:', error)
      throw new Error('Failed to fetch staffs')
    }
  }
}

module.exports = new AdminService()
