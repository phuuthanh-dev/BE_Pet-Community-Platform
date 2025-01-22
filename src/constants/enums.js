const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
}

const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SERVICE_STAFF: 'service_staff',
  FORUM_STAFF: 'forum_staff'
}

const TokenType = {
  AccessToken: 'access_token',
  RefreshToken: 'refresh_token',
  EmailVerifyToken: 'email_verify_token',
  ForgotPasswordToken: 'forgot_password_token'
}

const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

module.exports = { GENDER, ROLE, TokenType, TRANSACTION_STATUS }
