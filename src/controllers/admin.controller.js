const { getDashboardData, manageUser } = require('../services/admin.service.js')

// Function to get admin dashboard
const getAdminDashboard = (req, res) => {
  try {
    const dashboardData = getDashboardData()
    res.status(200).json(dashboardData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Function to manage users
const manageUsers = (req, res) => {
  const { action, userId } = req.body

  try {
    const result = manageUser(action, userId)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAdminDashboard,
  manageUsers
}
