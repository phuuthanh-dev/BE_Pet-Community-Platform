const mongoose = require('mongoose');

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
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false, index: true },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false, index: true },
    isRejected: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pagination Plugin
adoptionPostSchema.plugin(require('./plugins/paginate.plugin'));

const AdoptionPost = mongoose.model('AdoptionPost', adoptionPostSchema);
module.exports = AdoptionPost;
