const User = require('../models/user.model.js')
const { USER_MESSAGE } = require('../constants/messages.js')
const catchAsync = require('../utils/catchAsync.js')
const { getReceiverSocketId, io } = require('../socket/socket.js')
const { OK } = require('../configs/response.config.js')
const cloudinaryService = require('../utils/cloudinary.js')

class UserController {
  getProfile = catchAsync(async (req, res) => {
    const userId = req.params.id
    let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks')
    return OK(res, USER_MESSAGE.USER_PROFILE_FETCHED_SUCCESSFULLY, user)
  })

  editProfile = catchAsync(async (req, res) => {
    const userId = req.id
    const { bio, gender } = req.body
    const profilePicture = req.file

    let profilePictureUrl
    if (profilePicture) {
      profilePictureUrl = await cloudinaryService.uploadImage(profilePicture.buffer)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        gender,
        profilePicture: profilePictureUrl || undefined,
      },
      { new: true }
    )

    return OK(res, USER_MESSAGE.USER_PROFILE_UPDATED_SUCCESSFULLY, updatedUser)
  })

  getSuggestedUsers = catchAsync(async (req, res) => {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select('-password')
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
}
module.exports = new UserController()
