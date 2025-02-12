const Blog = require('../models/blog.model.js')
const blogRepo = require('../repositories/blog.repo.js')
const cloudinaryService = require('../utils/cloudinary')

class BlogService {
  constructor() {
    this.blog = Blog
  }

  createBlog = async ({ title, content, category, thumbnail, authorId }) => {
    // Upload thumbnail
    const thumbnailUrl = await cloudinaryService.uploadImage(thumbnail.buffer)

    const blog = await Blog.create({
      title,
      content, 
      category,
      thumbnail: thumbnailUrl,
      author: authorId
    })

    await blog.populate('author', 'username profilePicture isVerified')
    return blog
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

  getBlogById = async (blogId) => {
    return await Blog.findById(blogId)
      .populate('author', 'username profilePicture isVerified')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture isVerified'
        }
      });
  }

  updateBlog = async ({ blogId, title, content, category, thumbnail, userId }) => {
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return null
    }

    if (blog.author.toString() !== userId) {
      throw new Error('Unauthorized to update this blog')
    }

    let thumbnailUrl = blog.thumbnail
    if (thumbnail) {
      thumbnailUrl = await cloudinaryService.uploadImage(thumbnail.buffer)
    }

    return await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        category,
        thumbnail: thumbnailUrl
      },
      { new: true }
    ).populate('author', 'username profilePicture isVerified');
  }

  deleteBlog = async (blogId, userId) => {
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return null
    }

    if (blog.author.toString() !== userId) {
      throw new Error('Unauthorized to delete this blog')
    }

    await Blog.findByIdAndDelete(blogId)
    return true
  }
}

const blogService = new BlogService()
module.exports = blogService
