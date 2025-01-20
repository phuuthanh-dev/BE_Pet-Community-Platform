const User = require('../models/user.model.js')
const { USER_MESSAGE } = require('../constants/messages.js')
const catchAsync = require('../utils/catchAsync.js')
const { getReceiverSocketId, io } = require('../socket/socket.js')
const { OK } = require('../configs/response.config.js')
const cloudinaryService = require('../utils/cloudinary.js')
const Message = require('../models/message.model.js')

class UserController {
  getProfile = catchAsync(async (req, res) => {
    const username = req.params.username
    let user = await User.findOne({ username }).populate(['bookmarks', 'posts'])
    user.posts.sort((a, b) => b.createdAt - a.createdAt);
    return OK(res, USER_MESSAGE.USER_PROFILE_FETCHED_SUCCESSFULLY, user)
  })

  getProfileById = catchAsync(async (req, res) => {
    const userId = req.params.id
    let user = await User.findById(userId).populate(['bookmarks', 'posts'])
    user.posts.sort((a, b) => b.createdAt - a.createdAt);
    return OK(res, USER_MESSAGE.USER_PROFILE_FETCHED_SUCCESSFULLY, user)
  })

  editProfile = catchAsync(async (req, res) => {
    const { bio, gender, username, firstName, lastName } = req.body
    const userId = req.id
    const profilePicture = req.file

    const user = await User.findById(userId).select('-password')
    let profilePictureUrl
    if (profilePicture) {
      profilePictureUrl = await cloudinaryService.uploadImage(profilePicture.buffer)
      user.profilePicture = profilePictureUrl
    }
    if (!user) {
      return res.status(404).json({
        message: USER_MESSAGE.USER_NOT_FOUND,
        success: false
      })
    }

    if (bio) user.bio = bio
    if (gender) user.gender = gender
    if (username) {
      const isUsernameExists = await User.findOne({ username })
      if (isUsernameExists && isUsernameExists._id.toString() !== userId) {
        return BAD_REQUEST(res, USER_MESSAGE.USERNAME_ALREADY_EXISTS)
      }
      user.username = username
    }
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    await user.save()
    return OK(res, USER_MESSAGE.USER_PROFILE_UPDATED_SUCCESSFULLY, user)
  })

  getSuggestedUsers = catchAsync(async (req, res) => {
    const userId = req.id
    const user = await User.findById(userId)
    const suggestedUsers = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { _id: { $nin: user.following } }
      ]
    }).select('-password')
    if (!suggestedUsers) {
      return res.status(400).json({
        message: 'Currently do not have any users'
      })
    }
    return OK(res, USER_MESSAGE.USER_SUGGESTED_USERS_FETCHED_SUCCESSFULLY, suggestedUsers)
  })

  followOrUnfollow = catchAsync(async (req, res) => {
    const followKrneWala = req.id // patel
    const jiskoFollowKrunga = req.params.id // shivani

    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: 'You cannot follow/unfollow yourself',
        success: false
      })
    }

    const user = await User.findById(followKrneWala)
    const targetUser = await User.findById(jiskoFollowKrunga)

    if (!user || !targetUser) {
      return res.status(400).json({
        message: 'User not found',
        success: false
      })
    }
    // mai check krunga ki follow krna hai ya unfollow
    const isFollowing = user.following.includes(jiskoFollowKrunga)
    if (isFollowing) {
      // unfollow logic ayega
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
        User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } })
      ])
      const notification = {
        type: 'follow',
        userId: followKrneWala,
        userDetails: user,
        message: 'You are unfollowed'
      }
      const targetUserSocketId = getReceiverSocketId(jiskoFollowKrunga)
      io.to(targetUserSocketId).emit('notification', notification)
      return OK(res, USER_MESSAGE.USER_UNFOLLOWED_SUCCESSFULLY)
    } else {
      // follow logic ayega
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
        User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } })
      ])
      return OK(res, USER_MESSAGE.USER_FOLLOWED_SUCCESSFULLY)
    }
  })

  getChatUser = catchAsync(async (req, res) => {
    const userId = req.id
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).select('senderId receiverId')

    const userIds = messages.map(message => {
      return message.senderId == userId ? message.receiverId : message.senderId
    });

    const uniqueUserIds = [...new Set(userIds)];

    const chatUsers = await User.find({ _id: { $in: uniqueUserIds } }).select('-password');

    return OK(res, USER_MESSAGE.USER_CHAT_USERS_FETCHED_SUCCESSFULLY, chatUsers);
  })
}
module.exports = new UserController()
