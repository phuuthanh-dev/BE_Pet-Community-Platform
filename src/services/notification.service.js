const Notification = require('../models/notification.model')

class NotificationService {
  getNotifications = async (query, userId) => {
    const { q, page, limit, sortBy } = query
    const filter = { recipient: userId }

    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['message'],
      q: q ?? '',
      populate: 'recipient,sender,post'
    }
    return await Notification.paginate(filter, options)
  }
}
const notificationService = new NotificationService()
module.exports = notificationService