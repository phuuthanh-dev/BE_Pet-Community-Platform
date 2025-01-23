const Post = require('../models/post.model')

class PostRepoSitory {
  getAll = async (filter, options) => {
    return await Post.paginate(filter, options)
  }
}

module.exports = new PostRepoSitory()