class SuccessResponse {
  constructor({ message, status = 200, data = {}, options = {} }) {
    this.message = message
    this.status = status
    this.data = data
    this.options = options
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor({ message, data = {}, options = {} }) {
    super({ message, data, options })
  }
}

class Create extends SuccessResponse {
  constructor({ message, data = {}, options = {} }) {
    super({ message, status: 201, data, options })
  }
}

const CREATED = (res, message, data, options = {}) => {
  new Create({
    message,
    data,
    options
  }).send(res)
}

const OK = (res, message, data, options = {}) => {
  new Ok({
    message,
    data,
    options
  }).send(res)
}
const BAD_REQUEST = (res, message, data = null) => {
  return res.status(400).json({
    status: 'fail',
    message,
    data
  })
}

const FORBIDDEN = (res, message, data = null) => {
  return res.status(403).json({
    status: 'fail',
    message,
    data
  })
}

const NOT_FOUND = (res, message, data = null) => {
  return res.status(404).json({
    status: 'fail',
    message,
    data
  })
}
