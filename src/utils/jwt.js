const jwt = require('jsonwebtoken')

const signToken = ({
  payload,
  privateKey,
  optionts = {
    algorithm: 'HS256'
  }
}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, optionts, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
  })
}

const verifyToken = ({ token, secretOrPublicKey }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded)
      }
    })
  })
}

module.exports = {
  signToken,
  verifyToken
}