const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
}

const NOTIFICAITON_TYPE = {
  FOLLOW: 'follow',
  LIKE: 'like',
  COMMENT: 'comment',
  APPROVE: 'approve'
}

const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SERVICE_STAFF: 'services_staff',
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

module.exports = { GENDER, NOTIFICAITON_TYPE, ROLE, TokenType, TRANSACTION_STATUS }
