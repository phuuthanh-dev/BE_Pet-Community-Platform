const { ImgurClient } = require('imgur');
const ErrorWithStatus = require('./errorWithStatus');
const imgurClient = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

class ImgurService {
  uploadImage = async (imageFile) => {
    try {
      const res = await imgurClient.upload({
        image: imageFile.toString('base64'),
      })
      return res.data.link
    } catch (error) {
      throw new ErrorWithStatus(400, 'Upload image failed');
    }
  };
}

module.exports = new ImgurService();
