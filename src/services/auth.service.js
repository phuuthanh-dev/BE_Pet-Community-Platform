const bcrypt = require('bcryptjs')
const User = require('../models/user.model.js')
const { USER_MESSAGE } = require('../constants/messages.js')
const ErrorWithStatus = require('../utils/errorWithStatus.js')
const { StatusCodes } = require('http-status-codes')
const { signToken } = require('../utils/jwt.js')
const { TokenType } = require('../constants/enums.js')
class AuthService {
  signAccessToken = async ({ user_id }) => {
    return signToken({
      payload: { user_id, type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN_KEY,
      optionts: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  signRefreshToken = async ({ user_id }) => {
    return signToken({
      payload: { user_id, type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN_KEY,
      optionts: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  signEmailVerifyToken = async ({ user_id }) => {
    return signToken({
      payload: { user_id, type: TokenType.EmailVerifyToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN_KEY,
      optionts: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN }
    })
  }

  signForgotPasswordToken = async ({ user_id }) => {
    return signToken({
      payload: { user_id, type: TokenType.ForgotPasswordToken },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN_KEY,
      optionts: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN }
    })
  }

  signAccessAndRefreshToken = async ({ user_id }) => {
    return Promise.all([
      this.signAccessToken({ user_id }),
      this.signRefreshToken({ user_id })
    ])
  }

  constructor() {
    this.user = User
  }
  register = async (user) => {
    const { username, email, password } = user
    const isUserExists = await this.user.findOne({ email })
    if (isUserExists) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.EMAIL_ALREADY_EXISTS })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.user.create({
      username,
      email,
      password: hashedPassword
    })

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: newUser._id.toString()
    })

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: newUser._id.toString()
    })

    return {
      access_token,
      refresh_token,
      email_verify_token
    }
  }

  login = async (user) => {
    const { email, password } = user
    const isUserExists = await this.user.findOne({ email })
    if (!isUserExists) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.USER_NOT_FOUND })
    }
    const isPasswordMatch = await bcrypt.compare(password, isUserExists.password)
    if (!isPasswordMatch) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD })
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: isUserExists._id.toString()
    })
    return {
      access_token,
      refresh_token
    }
  }

  logout = async () => {
    return { message: 'Logged out successfully.' }
  }
}

const authService = new AuthService()
module.exports = authService
