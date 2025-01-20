const sharp = require('sharp')
const Post = require('../models/post.model.js')
const User = require('../models/user.model.js')
const Comment = require('../models/comment.model.js')
const { getReceiverSocketId, io } = require('../socket/socket.js')
const catchAsync = require('../utils/catchAsync.js')
const { CREATED, OK } = require('../configs/response.config.js')
const { POST_MESSAGE } = require('../constants/messages.js')
const { ObjectId } = require('mongoose').Types;
const imgurService = require('../utils/imgur.js')


class PostController {
  addNewPost = catchAsync(async (req, res) => {
    const { caption } = req.body
    const imageFiles = req.files
    console.log(imageFiles)
    const authorId = req.id

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        message: 'At least one image is required',
        success: false,
      });
    }

    const imageUrls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      // Ensure the file has a buffer property
      if (!imageFile.buffer) {
        return res.status(400).json({
          message: `Invalid file format for image ${i + 1}`,
          success: false,
        });
      }

      let optimizedImageBuffer;
      try {
        optimizedImageBuffer = await sharp(imageFile.buffer)
          .resize({ width: 800, height: 800, fit: 'inside' })
          .toFormat('jpeg', { quality: 80 })
          .toBuffer();
      } catch (error) {
        return res.status(500).json({
          message: `Error while processing image ${i + 1}`,
          success: false,
        });
      }

      // Upload image to Imgur
      const photoUrl = await imgurService.uploadImage(optimizedImageBuffer);

      if (!photoUrl) {
        return res.status(500).json({
          message: `Image ${i + 1} upload failed`,
          success: false,
        });
      }

      // Add the photo URL to the list
      imageUrls.push(photoUrl);
    }
    const post = await Post.create({
      caption,
      image: imageUrls,
      author: new ObjectId(authorId),
    })
    const user = await User.findById(authorId)
    if (user) {
      user.posts.push(post._id)
      await user.save()
    }

    await post.populate({ path: 'author', select: '-password' })

    return CREATED(res, POST_MESSAGE.POST_CREATED_SUCCESSFULLY, post)
  })
  getAllPost = catchAsync(async (req, res) => {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePicture isVerified'
      })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture isVerified',
        },
      });
    return OK(res, POST_MESSAGE.POST_FETCHED_SUCCESSFULLY, posts)
  })

  getUserPost = async (req, res) => {
    try {
      const authorId = req.id
      const posts = await Post.find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'author',
          select: 'username, profilePicture isVerified'
        })
        .populate({
          path: 'comments',
          sort: { createdAt: -1 },
          populate: {
            path: 'author',
            select: 'username, profilePicture isVerified'
          }
        })
      return res.status(200).json({
        posts,
        success: true
      })
    } catch (error) {
      console.log(error)
    }
  }
  likePost = async (req, res) => {
    try {
      const likeKrneWalaUserKiId = req.id
      const postId = req.params.id
      const post = await Post.findById(postId)
      if (!post) return res.status(404).json({ message: 'Post not found', success: false })

      // like logic started
      await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } })
      await post.save()

      // implement socket io for real time notification
      const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture')

      const postOwnerId = post.author.toString()
      if (postOwnerId !== likeKrneWalaUserKiId) {
        // emit a notification event
        const notification = {
          type: 'like',
          userId: likeKrneWalaUserKiId,
          userDetails: user,
          postId,
          message: 'Your post was liked'
        }
        const postOwnerSocketId = getReceiverSocketId(postOwnerId)
        io.to(postOwnerSocketId).emit('notification', notification)
      }

      return res.status(200).json({ message: 'Post liked', success: true })
    } catch (error) { }
  }
  dislikePost = async (req, res) => {
    try {
      const likeKrneWalaUserKiId = req.id
      const postId = req.params.id
      const post = await Post.findById(postId)
      if (!post) return res.status(404).json({ message: 'Post not found', success: false })

      // like logic started
      await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } })
      await post.save()

      // implement socket io for real time notification
      const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture')
      const postOwnerId = post.author.toString()
      if (postOwnerId !== likeKrneWalaUserKiId) {
        // emit a notification event
        const notification = {
          type: 'dislike',
          userId: likeKrneWalaUserKiId,
          userDetails: user,
          postId,
          message: 'Your post was liked'
        }
        const postOwnerSocketId = getReceiverSocketId(postOwnerId)
        io.to(postOwnerSocketId).emit('notification', notification)
      }

      return res.status(200).json({ message: 'Post disliked', success: true })
    } catch (error) { }
  }
  addComment = async (req, res) => {
    try {
      const postId = req.params.id
      const commentKrneWalaUserKiId = req.id

      const { text } = req.body

      const post = await Post.findById(postId)

      if (!text) return res.status(400).json({ message: 'text is required', success: false })

      const comment = await Comment.create({
        text,
        author: commentKrneWalaUserKiId,
        post: postId
      })

      await comment.populate({
        path: 'author',
        select: 'username profilePicture'
      })

      post.comments.push(comment._id)
      await post.save()

      return res.status(201).json({
        message: 'Comment Added',
        comment,
        success: true
      })
    } catch (error) {
      console.log(error)
    }
  }
  getCommentsOfPost = async (req, res) => {
    try {
      const postId = req.params.id

      const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture isVerified')

      if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false })

      return res.status(200).json({ success: true, comments })
    } catch (error) {
      console.log(error)
    }
  }
  deletePost = async (req, res) => {
    try {
      const postId = req.params.id
      const authorId = req.id

      const post = await Post.findById(postId)
      if (!post) return res.status(404).json({ message: 'Post not found', success: false })

      // check if the logged-in user is the owner of the post
      if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' })

      // delete post
      await Post.findByIdAndDelete(postId)

      // remove the post id from the user's post
      let user = await User.findById(authorId)
      user.posts = user.posts.filter((id) => id.toString() !== postId)
      await user.save()

      // delete associated comments
      await Comment.deleteMany({ post: postId })

      return res.status(200).json({
        success: true,
        message: 'Post deleted'
      })
    } catch (error) {
      console.log(error)
    }
  }
  getPostById = async (req, res) => {
    try {
      const postId = req.params.id
      const post = await Post.findById(postId)
        .populate('author', 'username profilePicture isVerified')
        .populate({
          path: 'comments',
          sort: { createdAt: -1 },
          populate: {
            path: 'author',
            select: 'username profilePicture isVerified'
          }
        })
      return res.status(200).json({ post, success: true })
    } catch (error) {
      console.log(error)
    }
  }
  bookmarkPost = async (req, res) => {
    try {
      const postId = req.params.id
      const authorId = req.id
      const post = await Post.findById(postId)
      if (!post) return res.status(404).json({ message: 'Post not found', success: false })

      const user = await User.findById(authorId)
      if (user.bookmarks.includes(post._id)) {
        // already bookmarked -> remove from the bookmark
        await user.updateOne({ $pull: { bookmarks: post._id } })
        await user.save()
        return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true })
      } else {
        // bookmark krna pdega
        await user.updateOne({ $addToSet: { bookmarks: post._id } })
        await user.save()
        return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = new PostController()
