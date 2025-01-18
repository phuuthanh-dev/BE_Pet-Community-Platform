const COMMON_MESSAGE = {
  SOMETHING_IS_MISSING: 'Something is missing, please check!',
  SOMETHING_WENT_WRONG: 'Something went wrong, please try again!',
  SOMETHING_WENT_WRONG_WITH_DATABASE: 'Something went wrong with database, please try again!'
}

const USER_MESSAGE = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_CREATED_SUCCESSFULLY: 'User created successfully',
  USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
  USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
  USER_LOGIN_SUCCESSFULLY: 'User login successfully',
  USER_LOGOUT_SUCCESSFULLY: 'User logout successfully',
  USER_SEND_VERIFY_EMAIL_SUCCESSFULLY: 'User send verify email successfully',
  INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
  GET_USER_PROFILE_SUCCESSFULLY: 'Get user profile successfully',
  USER_EMAIL_VERIFIED_SUCCESSFULLY: 'User email verified successfully',
  USER_FORGOT_PASSWORD_VERIFIED_SUCCESSFULLY: 'User forgot password verified successfully',
  USER_PASSWORD_RESET_SUCCESSFULLY: 'User password reset successfully'
}

const POST_MESSAGE = {
  POST_NOT_FOUND: 'Post not found',
  POST_CREATED_SUCCESSFULLY: 'Post created successfully',
  POST_UPDATED_SUCCESSFULLY: 'Post updated successfully',
  POST_DELETED_SUCCESSFULLY: 'Post deleted successfully'
}
module.exports = { COMMON_MESSAGE, USER_MESSAGE, POST_MESSAGE }
