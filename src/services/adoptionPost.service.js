const adoptionPostRepo = require('../repositories/adoptionPost.repo.js')
const AdoptionPost = require('../models/adoptionPost.model.js')
const cloudinaryService = require('../utils/cloudinary.js')
const sharp = require('sharp')
const User = require('../models/user.model.js')
const { ObjectId } = require('mongoose').Types
class AdoptionPostService {
  constructor() {
    this.post = AdoptionPost
  }
  getAdoptionPosts = async (query) => {
    const { sortBy, limit, page, q, adopt_status, ...filters } = query

    const defaultFilters = { isDeleted: false, isHidden: false }

    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 5,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['caption'],
      q: q ?? '',
      populate: 'pet,author,likes'
    }

    // Apply adopt_status filter if provided
    if (adopt_status) {
      filters.adopt_status = adopt_status
    }

    const finalFilter = { ...defaultFilters, ...filters }

    return await adoptionPostRepo.getAll(finalFilter, options)
  }

  createAdoptionPost = async (req, res) => {
    const { caption, authorId, petId } = req.body
    const mediaFiles = req.files
    if (!mediaFiles || mediaFiles.length === 0) {
      return res.status(400).json({
        message: 'At least one media file (image or video) is required.',
        success: false
      })
    }

    const imageUrls = []
    const videoUrls = []

    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaFile = mediaFiles[i]

      // Ensure file has the required buffer property
      if (!mediaFile.buffer) {
        return res.status(400).json({
          message: `Invalid file format for media ${i + 1}.`,
          success: false
        })
      }

      const fileType = mediaFile.mimetype.split('/')[0]

      try {
        if (fileType === 'image') {
          // Process and upload image
          const optimizedImageBuffer = await sharp(mediaFile.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()

          const imageUrl = await cloudinaryService.uploadImage(optimizedImageBuffer)
          if (!imageUrl) {
            return res.status(500).json({
              message: `Image ${i + 1} upload failed.`,
              success: false
            })
          }
          imageUrls.push(imageUrl)
        } else if (fileType === 'video') {
          const videoUrl = await cloudinaryService.uploadVideo(mediaFile.buffer)
          if (!videoUrl) {
            return res.status(500).json({
              message: `Video ${i + 1} upload failed.`,
              success: false
            })
          }
          videoUrls.push(videoUrl)
        } else {
          return res.status(400).json({
            message: `Unsupported media type for file ${i + 1}.`,
            success: false
          })
        }
      } catch (error) {
        return res.status(500).json({
          message: `Error while processing media ${i + 1}: ${error}`,
          success: false
        })
      }
    }

    // Create the post with the collected media URLs
    const adoptPost = await AdoptionPost.create({
      caption,
      author: new ObjectId(authorId),
      pet: new ObjectId(petId),
      image: imageUrls,
      video: videoUrls
    })

    const user = await User.findById(authorId)

    // Populate creater details in the response
    await adoptPost.populate([{ path: 'author', select: '-password' }, { path: 'pet' }])

    return adoptPost
  }
}

const adoptionPostService = new AdoptionPostService()
module.exports = adoptionPostService
