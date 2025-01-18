const { StatusCodes } = require('http-status-codes')
const { CREATED, OK } = require('../configs/response.config')
const { USER_MESSAGE, COMMON_MESSAGE } = require('../constants/messages')
const authService = require('../services/auth.service')
const ErrorWithStatus = require('../utils/errorWithStatus')
const catchAsync = require('../utils/catchAsync')

class AuthController {
  register = catchAsync(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.register(req.body)
    return CREATED(res, USER_MESSAGE.USER_CREATED_SUCCESSFULLY, result)
  })

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.login(req.body)
    return OK(res, USER_MESSAGE.USER_LOGIN_SUCCESSFULLY, result)
  })

  logout = catchAsync(async (_, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return OK(res, USER_MESSAGE.USER_LOGOUT_SUCCESSFULLY)
  })

  verifyEmail = catchAsync(async (req, res) => {
    const { email_verify_token } = req.body
    if (!email_verify_token) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.verifyEmail(email_verify_token)
    return OK(res, USER_MESSAGE.USER_EMAIL_VERIFIED_SUCCESSFULLY, result)
  })

  sendVerifyEmail = catchAsync(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.sendVerifyEmail(userId)
    return OK(res, USER_MESSAGE.USER_EMAIL_VERIFIED_SUCCESSFULLY, result)
  })

  verifyForgotPassword = catchAsync(async (req, res) => {
    const { forgot_password_token } = req.body
    if (!forgot_password_token) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.verifyForgotPassword(forgot_password_token)
    return OK(res, USER_MESSAGE.USER_FORGOT_PASSWORD_VERIFIED_SUCCESSFULLY, result)
  })

  resetPassword = catchAsync(async (req, res) => {
    const { userId, password, confirmPassword } = req.body
    if (!userId || !password || !confirmPassword) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING })
    }
    const result = await authService.resetPassword(userId, password, confirmPassword)
    return OK(res, USER_MESSAGE.USER_PASSWORD_RESET_SUCCESSFULLY, result)
  })
}

module.exports = new AuthController()