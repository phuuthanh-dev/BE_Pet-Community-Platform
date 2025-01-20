const { getReceiverSocketId, io } = require('../socket/socket.js')
const Message = require('../models/message.model.js')
const Conversation = require('../models/conversation.model.js')
const catchAsync = require('../utils/catchAsync.js')
const { OK } = require('../configs/response.config.js')
const { MESSAGE_MESSAGE } = require('../constants/messages')
// for chatting

class MessageController {
  sendMessage = catchAsync(async (req, res) => {
    const senderId = req.id
    const receiverId = req.params.id
    const { textMessage: message } = req.body

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })
    // establish the conversation if not started yet.
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    })
    if (newMessage) conversation.messages.push(newMessage._id)

    await Promise.all([conversation.save(), newMessage.save()])

    // implement socket io for real time data transfer
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    return res.status(201).json({
      success: true,
      newMessage
    })
  })
  getMessage = catchAsync(async (req, res) => {
    const senderId = req.id
    const receiverId = req.params.id

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('messages')
    if (!conversation) return OK(res, MESSAGE_MESSAGE.MESSAGE_FETCHED_SUCCESSFULLY, [])

    return OK(res, MESSAGE_MESSAGE.MESSAGE_FETCHED_SUCCESSFULLY, conversation?.messages)
  })
}

module.exports = new MessageController()
