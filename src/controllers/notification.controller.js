const { OK } = require('../configs/response.config')
const { NOTIFICATION_MESSAGE } = require('../constants/messages')
const notificationService = require('../services/notification.service')
const catchAsync = require('../utils/catchAsync')

class NotificationController {
  getNotifications = catchAsync(async (req, res) => {
    const notifications = await notificationService.getNotifications(req.query, req.id)
    return OK(res, NOTIFICATION_MESSAGE.GET_ALL_NOTIFICATIONS_SUCCESSFULLY, notifications)
  })
}

module.exports = new NotificationController()
