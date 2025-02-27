const catchAsync = require('../utils/catchAsync.js')
const { CREATED, OK } = require('../configs/response.config.js')
const { ADOPTION_POST_MESSAGE } = require('../constants/messages.js')
const adoptPostService = require('../services/adoptionPost.service.js')

class AdoptionPostController {
  getAllPost = catchAsync(async (req, res) => {
    const posts = await adoptPostService.getAdoptionPosts(req.query)
    return OK(res, ADOPTION_POST_MESSAGE.FETCH_ALL_SUCCESS, posts)
  })

  addNewPost = catchAsync(async (req, res) => {
    const adoptionPost = await adoptPostService.createAdoptionPost(req, res)
    return CREATED(res, ADOPTION_POST_MESSAGE.CREATED_SUCCESS, adoptionPost)
  })
}
module.exports = new AdoptionPostController()
