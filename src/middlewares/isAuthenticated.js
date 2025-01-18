const { StatusCodes } = require('http-status-codes')
const { verifyToken } = require('../utils/jwt.js')

const isAuthenticated = async (req, res, next) => {
  const accessTokenFromCookie = req.cookies?.access_token

  if (!accessTokenFromCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
  try {
    const accessTokenDecoded = await verifyToken(accessTokenFromCookie, process.env.JWT_SECRET_ACCESS_TOKEN_KEY)

    req.jwtDecoded = accessTokenDecoded
    req.id = accessTokenDecoded.userId
    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      return res.status(StatusCodes.GONE).json({ message: 'Gone' })
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

module.exports = isAuthenticated
