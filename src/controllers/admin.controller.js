const { OK } = require('../configs/response.config')
const { ADMIN_MESSAGE } = require('../constants/messages')
const adminService = require('../services/admin.service')

class adminController {
  getStats = async (req, res) => {
    const stats = await adminService.getStats()
    return OK(res, ADMIN_MESSAGE.GET_STATS_SUCCESSFULLY, stats)
  }

  getAllStaffs = async (req, res) => {
    const staffs = await adminService.getAllStaffs()
    return OK(res, ADMIN_MESSAGE.GET_ALL_STAFFS_SUCCESSFULLY, staffs)
  }
}

module.exports = new adminController()
