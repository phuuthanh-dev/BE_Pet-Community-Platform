const jwt = require('jsonwebtoken')

// const signToken = ({
//   payload,
//   privateKey,
//   options = {
//     algorithm: 'HS256'
//   }
// }) => {
//   return new Promise((resolve, reject) => {
//     jwt.sign(payload, privateKey, options, (error, token) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(token)
//       }
//     })
//   })
// }

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    // Hàm sign của JWT - thuật toán mặc định là HS256
    return jwt.sign(payload, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify của JWT - trả về payload đã được tạo ra token
    return jwt.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  generateToken,
  verifyToken
}