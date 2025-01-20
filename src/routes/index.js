const express = require('express')
const router = express.Router()
const userRoute = require('./user.route')
const postRoute = require('./post.route')
const messageRoute = require('./message.route')
const authRoute = require('./auth.route')
const paymentRoute = require('./payment.route')
const campaignRoute = require('./campaign.route')
const donationRoute = require('./donation.route')

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
    },
    {
        path: '/campaign',
        route: campaignRoute
    },
    {
        path: '/donation',
        route: donationRoute
    }
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

module.exports = router
