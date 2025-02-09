const Blog = require('../models/blog.model')
const catchAsync = require('../utils/catchAsync')
const cloudinaryService = require('../utils/cloudinary')
const blogRepo = require('../repositories/blog.repo.js')
const { OK } = require('../configs/response.config.js')
const { BLOG_MESSAGE } = require('../constants/messages.js')
const blogService = require('../services/blog.service.js')



class BlogController {
    // Tạo blog mới
    createBlog = catchAsync(async (req, res) => {
        const { title, content, category } = req.body
        const thumbnail = req.file
        const authorId = req.id

        if (!thumbnail) {
            return res.status(400).json({
                message: 'Thumbnail is required',
                success: false
            });
        }

        const blog = await blogService.createBlog({
            title,
            content,
            category,
            thumbnail,
            authorId
        })

        return res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        })
    })

    // Lấy tất cả blogs
    getAllBlogs = catchAsync(async (req, res) => {
        const blogs = await blogService.getAllBlog(req.query)
        return OK(res, BLOG_MESSAGE.BLOG_FETCHED_SUCCESSFULLY, blogs)
    });


    // Lấy blog theo ID
    getBlogById = catchAsync(async (req, res) => {
        const blog = await blogService.getBlogById(req.params.id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: blog
        });
    });

    // Cập nhật blog
    updateBlog = catchAsync(async (req, res) => {
        const { title, content, category } = req.body
        const thumbnail = req.file
        const blogId = req.params.id
        const userId = req.id

        try {
            const updatedBlog = await blogService.updateBlog({
                blogId,
                title,
                content,
                category,
                thumbnail,
                userId
            })

            if (!updatedBlog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Blog updated successfully',
                data: updatedBlog
            });
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
    });

    // Xóa blog
    deleteBlog = catchAsync(async (req, res) => {
        try {
            const result = await blogService.deleteBlog(req.params.id, req.id)

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Blog deleted successfully'
            })
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
    })
}

module.exports = new BlogController()