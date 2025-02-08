const Blog = require("../models/blog.model")

class BlogRepoSitory {
  getAll = async (filter, options) => {
    return await Blog.paginate(filter, options)
  }
}

module.exports = new BlogRepoSitory()
