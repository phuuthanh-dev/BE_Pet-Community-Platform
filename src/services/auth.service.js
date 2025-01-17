const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model.js");
const { USER_MESSAGE } = require("../constants/messages.js");
const { ErrorWithStatus } = require("../utils/errorWithStatus.js");
const { StatusCodes } = require("http-status-codes");

class AuthService {
  constructor() {
    this.user = User;
  }
  register = async (user) => {
    const { username, email, password } = user;
    const isUserExists = await this.user.findOne({ email });
    if (isUserExists) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.EMAIL_ALREADY_EXISTS });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.user.create({
      username,
      email,
      password: hashedPassword
    });
  };

  login = async (user) => {
    const { email, password } = user;
    const isUserExists = await this.user.findOne({ email });
    if (!isUserExists) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.USER_NOT_FOUND });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD });
    }
    return user;
  };

  logout = async () => {
    return { message: 'Logged out successfully.' };
  };
}

const authService = new AuthService();
module.exports = authService;
