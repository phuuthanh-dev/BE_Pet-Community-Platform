const mongoose = require('mongoose')

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 32 },
    breed: { type: String, required: true, trim: true, maxlength: 32 },
    age: { type: Number, required: true, min: 0 },
    health_status: {
      type: String,
      required: true,
      trim: true,
      enum: ['Healthy', 'Sick', 'Recovering', 'Injured'],
      default: 'Healthy'
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image_url: { type: [String], required: false, trim: true },
    characteristics: {
      type: {
        size: { type: String, required: true, trim: true, maxlength: 32 },
        coat: { type: String, required: true, trim: true, maxlength: 32 },
        temperament: { type: String, required: true, trim: true, maxlength: 32 }
      },
      required: true
    },
    vaccinated: { type: Boolean, required: true, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    isApproved: { type: Boolean, default: false },
    isAdopted: {
      type: Boolean,
      default: false
    },
    adoptionRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

const Pet = mongoose.model('Pet', petSchema)
module.exports = Pet
