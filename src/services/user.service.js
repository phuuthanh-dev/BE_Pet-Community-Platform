const bcrypt = require('bcryptjs')
const User = require('../models/user.model.js')
const { USER_MESSAGE } = require('../constants/messages.js')
const ErrorWithStatus = require('../utils/errorWithStatus.js')
const { StatusCodes } = require('http-status-codes')
class UserService {

  constructor() {
    this.user = User
  }
  getProfile = async (userId) => {
    let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).select('-password')
    return {
      message: 'Your profile',
      user
    }
  }

  followOrUnfollow = async (userId, targetUserId) => {
    const user = await User.findById(userId)
    const targetUser = await User.findById(targetUserId)
    if (!user || !targetUser) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.USER_NOT_FOUND })
    }
    if (user.following.includes(targetUserId)) {
      await User.updateOne({ _id: userId }, { $pull: { following: targetUserId } })
      await User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } })
      return {
        message: 'Unfollowed successfully',
        user
      }
    } else {
      await User.updateOne({ _id: userId }, { $push: { following: targetUserId } })
      await User.updateOne({ _id: targetUserId }, { $push: { followers: userId } })
      return {
        message: 'Followed successfully',
        user
      }
    }
  }
}

const userService = new UserService()
module.exports = userService
