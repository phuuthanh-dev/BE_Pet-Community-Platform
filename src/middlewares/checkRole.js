const checkRole = (role) => {
    return (req, res, next) => {
      if (req.role !== role) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: Access denied' })
      }
      next()
    }
  }
  
  module.exports = checkRole
  