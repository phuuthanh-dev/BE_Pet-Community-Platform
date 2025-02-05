const cloudinary = require('cloudinary').v2
const ErrorWithStatus = require('./errorWithStatus')
require('dotenv').config()

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

class CloudinaryService {
  /**
   * Upload an image to Cloudinary
   * @param {Buffer} imageFile - The image file buffer
   * @returns {Promise<string>} - The URL of the uploaded image
   */
  uploadImage = async (imageFile) => {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: 'image-pet-love'
            },
            (error, result) => {
              if (error) {
                reject(new ErrorWithStatus(400, 'Upload image failed'))
              }
              resolve(result)
            }
          )
          .end(imageFile)
      })
      return result.secure_url // Return the URL of the uploaded image
    } catch (error) {
      console.error('Image upload failed:', error)
      throw new ErrorWithStatus(400, 'Upload image failed')
    }
  }

  /**
   * Upload a video to Cloudinary
   * @param {Buffer} videoFile - The video file buffer
   * @returns {Promise<string>} - The URL of the uploaded video
   */
  uploadVideo = async (videoFile) => {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'video',
              folder: 'video-pet-love'
            },
            (error, result) => {
              if (error) {
                reject(new ErrorWithStatus(400, 'Upload video failed'))
              }
              resolve(result)
            }
          )
          .end(videoFile)
      })
      return result.secure_url // Return the URL of the uploaded video
    } catch (error) {
      console.error('Video upload failed:', error)
      throw new ErrorWithStatus(400, 'Upload video failed')
    }
  }
}

module.exports = new CloudinaryService()
