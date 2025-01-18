const express = require('express')
const router = express.Router()
const userRoute = require('./user.route')
const postRoute = require('./post.route')
const messageRoute = require('./message.route')
const authRoute = require('./auth.route')
const paymentRoute = require('./payment.route')

const routes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/user',
    route: userRoute
  },
  {
    path: '/post',
    route: postRoute
  },
  {
    path: '/message',
    route: messageRoute
  },
  {
    path: '/payment',
    route: paymentRoute
  }
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

module.exports = router
