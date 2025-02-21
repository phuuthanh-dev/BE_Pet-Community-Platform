const { StatusCodes } = require('http-status-codes')
const { verifyToken } = require('../utils/jwt.js')

const isAuthenticated = async (req, res, next) => {
  const access_token = req.headers.authorization?.split(' ')[1]

  if (!access_token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
  try {
    const accessTokenDecoded = await verifyToken(access_token, process.env.JWT_SECRET_ACCESS_TOKEN_KEY)

    req.jwtDecoded = accessTokenDecoded
    req.id = accessTokenDecoded.userId
    req.role = accessTokenDecoded.role
    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      return res.status(StatusCodes.GONE).json({ message: 'Gone' })
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

module.exports = isAuthenticated
