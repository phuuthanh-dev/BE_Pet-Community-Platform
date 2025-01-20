const COMMON_MESSAGE = {
  SOMETHING_IS_MISSING: 'Something is missing, please check!',
  SOMETHING_WENT_WRONG: 'Something went wrong, please try again!',
  SOMETHING_WENT_WRONG_WITH_DATABASE: 'Something went wrong with database, please try again!'
}

const USER_MESSAGE = {
  USER_NOT_FOUND: 'User not found',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  USER_ALREADY_EXISTS: 'User already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_CREATED_SUCCESSFULLY: 'User created successfully',
  USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
  USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
  USER_LOGIN_SUCCESSFULLY: 'User login successfully',
  USER_LOGOUT_SUCCESSFULLY: 'User logout successfully',
  USER_PROFILE_UPDATED_SUCCESSFULLY: 'User profile updated successfully',
  USER_PROFILE_FETCHED_SUCCESSFULLY: 'User profile fetched successfully',
  USER_FOLLOWED_SUCCESSFULLY: 'User followed successfully',
  USER_UNFOLLOWED_SUCCESSFULLY: 'User unfollowed successfully',
  INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password'
}

const POST_MESSAGE = {
  POST_NOT_FOUND: 'Post not found',
  POST_CREATED_SUCCESSFULLY: 'Post created successfully',
  POST_UPDATED_SUCCESSFULLY: 'Post updated successfully',
  POST_DELETED_SUCCESSFULLY: 'Post deleted successfully'
}
module.exports = { COMMON_MESSAGE, USER_MESSAGE, POST_MESSAGE }
