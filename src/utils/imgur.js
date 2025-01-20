const { ImgurClient } = require('imgur')
const ErrorWithStatus = require('./errorWithStatus')
const imgurClient = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

class ImgurService {
  /**
   * Upload an image to Imgur
   * @param {Buffer} imageFile - The image file buffer
   * @returns {Promise<string>} - The URL of the uploaded image
   */
  uploadImage = async (imageFile) => {
    try {
      const res = await imgurClient.upload({
        image: imageFile.toString('base64'),
        type: 'base64'
      })
      return res.data.link
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new ErrorWithStatus(400, 'Upload image failed')
    }
  }

  /**
   * Upload a video to Imgur
   * @param {Buffer} videoFile - The video file buffer
   * @returns {Promise<string>} - The URL of the uploaded video
   */
  uploadVideo = async (videoFile) => {
    try {
      const res = await imgurClient.upload({
        video: videoFile.toString('base64'),
        type: 'base64',
      });
      console.log("🚀 ~ ImgurService ~ uploadVideo= ~ res:", res)
      return res.data.link; // Ensure this is a string URL, not a function
    } catch (error) {
      console.error('Video upload failed:', error);
      throw new ErrorWithStatus(400, 'Upload video failed');
    }
  };
}

module.exports = new ImgurService()
