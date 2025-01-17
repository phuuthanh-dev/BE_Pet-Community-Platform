const { StatusCodes } = require('http-status-codes')
const { ErrorWithStatus } = require('../utils/errorWithStatus.js')

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    return
  }

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
  next()
}

module.exports = { errorHandler }
