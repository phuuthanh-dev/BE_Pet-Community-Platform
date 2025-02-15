const express = require('express')
const router = express.Router()
const userRoute = require('./user.route')
const postRoute = require('./post.route')
const adoptionPostRoute = require('./adoptionPost.route')
const messageRoute = require('./message.route')
const authRoute = require('./auth.route')
const paymentRoute = require('./payment.route')
const campaignRoute = require('./campaign.route')
const donationRoute = require('./donation.route')
const notificationRoute = require('./notification.route')
const blogRoute = require('./blog.route')
const petRoute = require('./pet.route')
const adminRoute = require('./admin.route')

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
    path: '/adoption-post',
    route: adoptionPostRoute
  },
  {
    path: '/message',
    route: messageRoute
  },
  {
    path: '/payment',
    route: paymentRoute
  },
  {
    path: '/campaign',
    route: campaignRoute
  },
  {
    path: '/donation',
    route: donationRoute
  },
  {
    path: '/notification',
    route: notificationRoute
  },
  {
    path: '/blog',
    route: blogRoute
  },
  {
    path: '/pets',
    route: petRoute
  },
  // admin
  {
    path: '/admin',
    route: adminRoute
  }
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

module.exports = router
