const User = require('../models/user.model') // Assuming you have a User model
const Donation = require('../models/donation.model') // Assuming you have a Donation model

const getDashboardData = async () => {
  try {
    const usersCount = await User.countDocuments({ isActive: true })
    const donationsCount = await Donation.countDocuments()

    const dashboardData = {
      usersCount,
      donationsCount
    }

    return dashboardData
  } catch (error) {
    throw new Error('Error retrieving dashboard data')
  }
}

// Function to manage users
const manageUser = (action, userId) => {
  if (action === 'ban') {
    return { message: `User ${userId} banned successfully` }
  } else if (action === 'unban') {
    return { message: `User ${userId} unbanned successfully` }
  } else {
    throw new Error('Invalid action')
  }
}

module.exports = {
  getDashboardData,
  manageUser
}
