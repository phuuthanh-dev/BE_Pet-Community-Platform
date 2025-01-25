const mongoose = require('mongoose')
const { NOTIFICAITON_TYPE } = require('../constants/enums')
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(NOTIFICAITON_TYPE),
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  read: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  }

}, { timestamps: true })


notificationSchema.plugin(require('./plugins/paginate.plugin'))

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification
