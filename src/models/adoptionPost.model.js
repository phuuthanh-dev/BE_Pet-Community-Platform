const mongoose = require('mongoose')

const adoptionPostSchema = new mongoose.Schema(
  {
    caption: { type: String, default: '' },
    image: [{ type: String, required: true }],
    video: [{ type: String }],
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, index: true },
    adopt_status: {
      type: String,
      required: true,
      trim: true,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
      index: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    isHidden: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
  },
  { timestamps: true }
)

// Pagination Plugin
adoptionPostSchema.plugin(require('./plugins/paginate.plugin'))

const AdoptionPost = mongoose.model('AdoptionPost', adoptionPostSchema)
module.exports = AdoptionPost
