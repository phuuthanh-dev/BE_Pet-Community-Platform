const Blog = require('../models/blog.model')
const catchAsync = require('../utils/catchAsync')
const cloudinaryService = require('../utils/cloudinary')

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

        return res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        })
    })

    // Lấy tất cả blogs
    getAllBlogs = catchAsync(async (req, res) => {
        const { category, page = 1, limit = 10 } = req.query;
        const filter = category ? { category } : {};
        console.log('Filter:', filter);
        try {
            const blogs = await Blog.paginate(filter, {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: 'author'
            });
            console.log('Blogs:', blogs); 
            return res.status(200).json({
                success: true,
                data: blogs
            });
        } catch (error) {
            console.error('Error fetching blogs:', error); 
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    });

    // Lấy blog theo ID
    getBlogById = catchAsync(async (req, res) => {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username profilePicture isVerified')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture isVerified'
                }
            });

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

        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this blog'
            });
        }

        let thumbnailUrl = blog.thumbnail
        if (thumbnail) {
            thumbnailUrl = await cloudinaryService.uploadImage(thumbnail.buffer)
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                content,
                category,
                thumbnail: thumbnailUrl
            },
            { new: true }
        ).populate('author', 'username profilePicture isVerified');

        return res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    });

    // Xóa blog
    deleteBlog = catchAsync(async (req, res) => {
        const blog = await Blog.findById(req.params.id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        if (blog.author.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this blog'
            });
        }

        await Blog.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        })
    })
}

module.exports = new BlogController()