
const blogRepo = require('../repositories/blog.repo.js')

const Blog = require('../models/blog.model.js')

class BlogService {
  constructor() {
    this.blog = Blog
  }
  getAllBlog = async (query) => {
    const { sortBy, limit, page, q } = query
    const filter = {}
    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 5,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['content', 'title'],
      q: q ?? '',
      populate: 'author'
    }

    return await blogRepo.getAll(filter, options)
  }
}

const blogService = new BlogService()
module.exports = blogService
