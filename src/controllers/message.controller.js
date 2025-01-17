const { getReceiverSocketId, io } = require("../socket/socket.js");
const Message = require("../models/message.model.js")
const Conversation = require("../models/conversation.model.js");
// for chatting

class MessageController {
    sendMessage = async (req, res) => {
        try {
            const senderId = req.id;
            const receiverId = req.params.id;
            const { textMessage: message } = req.body;
            console.log(senderId, receiverId);

            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            });
            // establish the conversation if not started yet.
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId]
                })
            };
            const newMessage = await Message.create({
                senderId,
                receiverId,
                message
            });
            if (newMessage) conversation.messages.push(newMessage._id);

            await Promise.all([conversation.save(), newMessage.save()])

            // implement socket io for real time data transfer
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            return res.status(201).json({
                success: true,
                newMessage
            })
        } catch (error) {
            console.log(error);
        }
    }
    getMessage = async (req, res) => {
        try {
            const senderId = req.id;
            const receiverId = req.params.id;

            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            }).populate('messages');
            if (!conversation) return res.status(200).json({ success: true, messages: [] });

            return res.status(200).json({ success: true, messages: conversation?.messages });

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new MessageController();
