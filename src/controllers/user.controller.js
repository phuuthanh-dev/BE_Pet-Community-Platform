const { USER_MESSAGE } = require('../constants/messages.js')
const catchAsync = require('../utils/catchAsync.js')
const { OK } = require('../configs/response.config.js')
const userService = require('../services/user.service.js')

class UserController {
  getProfile = catchAsync(async (req, res) => {
    const user = await userService.getProfile(req.params.username)
    OK(res, USER_MESSAGE.USER_PROFILE_FETCHED_SUCCESSFULLY, user)
  })

  getProfileById = catchAsync(async (req, res) => {
    const user = await userService.getProfileById(req.params.id)
    return OK(res, USER_MESSAGE.USER_PROFILE_FETCHED_SUCCESSFULLY, user)
  })

  editProfile = catchAsync(async (req, res) => {
    const user = await userService.editProfile(req.id, req.body, req.file)
    return OK(res, USER_MESSAGE.USER_PROFILE_UPDATED_SUCCESSFULLY, user)
  })

  getSuggestedUsers = catchAsync(async (req, res) => {
    const users = await userService.getSuggestedUsers(req.id)
    return OK(res, USER_MESSAGE.USER_SUGGESTED_USERS_FETCHED_SUCCESSFULLY, users)
  })

  followOrUnfollow = catchAsync(async (req, res) => {
    const result = await userService.followOrUnfollow(req.id, req.params.id)
    const message = result.action === 'follow' ?
      USER_MESSAGE.USER_FOLLOWED_SUCCESSFULLY :
      USER_MESSAGE.USER_UNFOLLOWED_SUCCESSFULLY
    return OK(res, message)
  })

  getChatUser = catchAsync(async (req, res) => {
    const users = await userService.getChatUsers(req.id)
    return OK(res, USER_MESSAGE.USER_CHAT_USERS_FETCHED_SUCCESSFULLY, users)
  })
}
module.exports = new UserController()
