const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  image: [{ type: String, required: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true })
const Post = mongoose.model('Post', postSchema)
module.exports = Post
