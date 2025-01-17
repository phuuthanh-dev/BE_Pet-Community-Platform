const mongoose = require('mongoose')
const GENDER = require('../constants/enums.js')

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: Object.values(GENDER) },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    address: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null },
    role: { type: String, enum: [ROLE.USER, ROLE.ADMIN, ROLE.SERVICE_STAFF, ROLE.FORUM_STAFF], default: ROLE.USER }
  },
  { timestamps: true }
)
const User = mongoose.model('User', userSchema)
module.exports = User
