const COMMON_MESSAGE = {
  SOMETHING_IS_MISSING: 'Something is missing, please check!',
  SOMETHING_WENT_WRONG: 'Something went wrong, please try again!',
  SOMETHING_WENT_WRONG_WITH_DATABASE: 'Something went wrong with database, please try again!'
}

const USER_MESSAGE = {
  USER_NOT_FOUND: 'User not found',
  USER_BLOCKED_SUCCESSFULLY: 'User blocked',
  USER_UNBLOCKED_SUCCESSFULLY: 'User unblocked',
  USER_NOT_BLOCKED: 'User not blocked',
  USER_NOT_UNBLOCKED: 'User not unblocked',
  USER_NOT_FOLLOWED: 'User not followed',
  USER_NOT_UNFOLLOWED: 'User not unfollowed',
  USER_NOT_UPDATED: 'User not updated',
  USER_SUGGESTED_USERS_FETCHED_SUCCESSFULLY: 'User suggested users fetched successfully',
  USER_CHAT_USERS_FETCHED_SUCCESSFULLY: 'User chat users fetched successfully',
  USERS_FETCHED_SUCCESSFULLY: 'Users fetched successfully',
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
  POST_DELETED_SUCCESSFULLY: 'Post deleted successfully',
  GET_ALL_POSTS_SUCCESSFULLY: 'Get all posts successfully',
  GET_POST_SUCCESSFULLY: 'Get post successfully',
  POST_FETCHED_SUCCESSFULLY: 'Post fetched successfully'
}

const ADOPTION_POST_MESSAGE = {
  NOT_FOUND: 'Adoption post not found',
  CREATED_SUCCESS: 'Adoption post created successfully',
  UPDATED_SUCCESS: 'Adoption post updated successfully',
  DELETED_SUCCESS: 'Adoption post deleted successfully',
  FETCH_ALL_SUCCESS: 'Successfully retrieved all adoption posts',
  FETCH_SUCCESS: 'Successfully retrieved adoption post'
};


const CAMPAIGN_MESSAGE = {
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  CAMPAIGN_CREATED_SUCCESSFULLY: 'Campaign created successfully',
  CAMPAIGN_UPDATED_SUCCESSFULLY: 'Campaign updated successfully',
  CAMPAIGN_DELETED_SUCCESSFULLY: 'Campaign deleted successfully',
  GET_CURRENT_CAMPAIGN_SUCCESSFULLY: 'Get current campaign successfully'
}

const DONATION_MESSAGE = {
  DONATION_CREATED_SUCCESSFULLY: 'Donation created successfully'
}

const MESSAGE_MESSAGE = {
  MESSAGE_FETCHED_SUCCESSFULLY: 'Message fetched successfully'
}

const TRANSACTION_MESSAGE = {
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_ALREADY_CANCELLED: 'Transaction already cancelled',
  TRANSACTION_ALREADY_COMPLETED: 'Transaction already completed',
  TRANSACTION_CANCEL_FAILED: 'Transaction cancel failed',
  TRANSACTION_CREATED_SUCCESSFULLY: 'Transaction created successfully',
  TRANSACTION_UPDATED_SUCCESSFULLY: 'Transaction updated successfully',
  TRANSACTION_CANCELLED_SUCCESSFULLY: 'Transaction cancelled successfully',
  GET_ALL_TRANSACTIONS_SUCCESSFULLY: 'Get all transactions successfully',
  TRANSACTION_FETCHED_SUCCESSFULLY: 'Transaction fetched successfully'
}

const NOTIFICATION_MESSAGE = {
  GET_ALL_NOTIFICATIONS_SUCCESSFULLY: 'Get notifications successfully'
}

module.exports = {
  NOTIFICATION_MESSAGE,
  COMMON_MESSAGE,
  USER_MESSAGE,
  POST_MESSAGE,
  ADOPTION_POST_MESSAGE,
  CAMPAIGN_MESSAGE,
  DONATION_MESSAGE,
  MESSAGE_MESSAGE,
  TRANSACTION_MESSAGE
}
