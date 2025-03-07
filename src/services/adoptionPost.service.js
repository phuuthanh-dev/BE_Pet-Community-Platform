const adoptionPostRepo = require('../repositories/adoptionPost.repo.js')
const AdoptionPost = require('../models/adoptionPost.model.js')
const cloudinaryService = require('../utils/cloudinary.js')
const sharp = require('sharp')
const User = require('../models/user.model.js')
const Pet = require('../models/pet.model.js')
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
      populate: 'pet.breed,author,likes'
    }

    // Apply adopt_status filter if provided
    if (adopt_status) {
      filters.adopt_status = adopt_status
    }

    const finalFilter = { ...defaultFilters, ...filters }

    return await adoptionPostRepo.getAll(finalFilter, options)
  }

  createAdoptionPost = async (req, res) => {
    const { caption, petId, location } = req.body
    const authorId = req.id
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
      location: location,
      image: imageUrls,
      video: videoUrls
    })

    const pet = await Pet.findById(petId)

    if (pet) {
      pet.isAddPost = true
      await pet.save()
    }

    // Populate creater details in the response
    await adoptPost.populate([{ path: 'author', select: '-password' }, { path: 'pet' }])

    return adoptPost
  }

  updateAdoptionPost = async (req, res) => {
    const { postId, caption, location, adopt_status, existingImages } = req.body
    const mediaFiles = req.files || []
    const userId = req.id

    // Validate required fields
    if (!postId) {
      return res.status(400).json({
        message: 'Post ID is required.',
        success: false
      })
    }

    // Find the existing post
    const post = await AdoptionPost.findById(postId).populate('author')
    if (!post) {
      return res.status(404).json({
        message: 'Adoption post not found.',
        success: false
      })
    }

    let updatedImages = post.image
    if (existingImages) {
      try {
        const parsedExistingImages = JSON.parse(existingImages)
        updatedImages = post.image.filter((img) => parsedExistingImages.includes(img))
      } catch (error) {
        return res.status(400).json({
          message: 'Invalid existingImages format.',
          success: false
        })
      }
    }

    // Process new media files (images/videos)
    const imageUrls = [...updatedImages]
    const videoUrls = [...(post.video || [])]

    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaFile = mediaFiles[i]

      if (!mediaFile.buffer) {
        return res.status(400).json({
          message: `Invalid file format for media ${i + 1}.`,
          success: false
        })
      }

      const fileType = mediaFile.mimetype.split('/')[0]

      try {
        if (fileType === 'image') {
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
          message: `Error while processing media ${i + 1}: ${error.message}`,
          success: false
        })
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        message: 'At least one image is required.',
        success: false
      })
    }

    // Update the post
    const updatedFields = {
      ...(caption !== undefined && { caption }),
      ...(location !== undefined && { location }),
      ...(adopt_status && { adopt_status }),
      image: imageUrls,
      video: videoUrls,
      updatedBy: new ObjectId(userId)
    }

    const updatedPost = await AdoptionPost.findByIdAndUpdate(
      postId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).populate([{ path: 'author', select: '-password' }, { path: 'pet' }])

    if (!updatedPost) {
      return res.status(500).json({
        message: 'Failed to update post.',
        success: false
      })
    }

    return updatedPost
  }

  getPostByBreed = async (breedId, query) => {
    const pet = await Pet.find({ breed: breedId })
    if (!pet) {
      throw new Error('Pet not found.')
    }
    const { sortBy, limit, page, q } = query
    const filters = { isDeleted: false, isHidden: false, pet: { $in: pet } }
    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 5,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['caption'],
      populate: 'pet,author,likes',
      q: q ?? ''
    }

    return await adoptionPostRepo.getAll(filters, options)
  }
}

const adoptionPostService = new AdoptionPostService()
module.exports = adoptionPostService
