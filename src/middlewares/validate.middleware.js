const Joi = require('joi')
const ErrorWithStatus = require('../utils/errorWithStatus')
const { StatusCodes } = require('http-status-codes')
const _ = require('lodash')

const validate = (schema) => (req, res, next) => {
  const validSchema = _.pick(schema, ['params', 'query', 'body'])
  const object = _.pick(req, Object.keys(validSchema))
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ')
    return next(new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: errorMessage }))
  }
  Object.assign(req, value)
  return next()
}

module.exports = validate
