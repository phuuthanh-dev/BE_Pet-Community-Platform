const Pet = require('../models/pet.model')
const mongoose = require('mongoose')
const ErrorWithStatus = require('../utils/errorWithStatus')
const { StatusCodes } = require('http-status-codes')
const cloudinaryService = require('../utils/cloudinary')
const { getReceiverSocketId, io } = require('../socket/socket')
const Notification = require('../models/notification.model')
const { NOTIFICAITON_TYPE } = require('../constants/enums')

class PetService {
  async createPet(petData, imagelUrl) {
    try {
      const newPet = await Pet.create({
        ...petData,
        image_url: imagelUrl,
        isApproved: true
      })
      return newPet
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ErrorWithStatus({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation Error'
        })
      }
      throw new ErrorWithStatus({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error adding pet' })
    }
  }

  async updatePet(petData) {
    const { id, ...updateData } = petData

    if (!id) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet ID is required for update' })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Invalid Pet ID format' })
    }

    const updatedPet = await Pet.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedPet) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: 'Pet not found with the given ID' })
    }

    return updatedPet
  }

  async deletePet(petId) {
    try {
      if (!petId) {
        throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet ID is required' })
      }

      const deletedPet = await Pet.findByIdAndDelete(petId)
      if (!deletedPet) {
        throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: 'Pet not found' })
      }

      return deletedPet
    } catch (error) {
      if (error.name === 'CastError') {
        throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Invalid Pet ID format' })
      }
      throw new ErrorWithStatus({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error deleting pet' })
    }
  }

  async submitPet(userId, petData, imageUrl) {
    if (!imageUrl) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'No file uploaded' })
    }
    if (!userId) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'User ID is required' })
    }

    const newPet = await Pet.create({
      ...petData,
      submittedBy: userId,
      owner: userId,
      image_url: imageUrl,
      isApproved: false
    })

    return newPet
  }

  async getAllPetNotApproved() {
    const pets = await Pet.find({ isApproved: false }).populate('submittedBy')
    return pets
  }

  async approvePet(petId) {
    const pet = await Pet.findById(petId).populate('submittedBy')
    if (!pet) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: 'Pet not found' })
    }

    if (pet.isApproved) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet is already approved' })
    }

    pet.owner = null
    pet.isApproved = true
    await pet.save()

    const notification = await Notification.create({
      type: NOTIFICAITON_TYPE.APPROVE,
      sender: null,
      recipient: pet.submittedBy._id,
      post: null,
      message: `Yêu cầu nhận nuôi thú cưng của bạn đã được phê duyệt!`,
      read: false
    })

    const userSocketId = getReceiverSocketId(pet.submittedBy._id.toString())
    if (userSocketId) {
      io.to(userSocketId).emit('notification', {
        ...notification.toObject(),
        sender: null
      })
    }

    return pet
  }

  async requestAdoption(userId, petId) {
    if (!userId || !petId) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'User ID and Pet ID are required' })
    }

    const pet = await Pet.findById(petId)
    if (!pet) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: 'Pet not found' })
    }
    if (!pet.isApproved) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet is not available for adoption' })
    }
    if (pet.isAdopted) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet has already been adopted' })
    }

    if (pet.adoptionRequests.includes(userId)) {
      throw new ErrorWithStatus({
        status: StatusCodes.BAD_REQUEST,
        message: 'You have already requested to adopt this pet'
      })
    }

    pet.adoptionRequests.push(userId)
    await pet.save()

    return pet
  }

  async adoptPet(userId, petId) {
    const pet = await Pet.findById(petId)
    if (!pet) {
      throw new ErrorWithStatus({ status: StatusCodes.NOT_FOUND, message: 'Pet not found' })
    }

    if (!pet.isApproved) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet is not available for adoption' })
    }
    if (pet.isAdopted) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet has already been adopted' })
    }

    if (pet.owner) {
      throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: 'Pet has already been adopted' })
    }
    if (!pet.adoptionRequests.includes(userId)) {
      throw new ErrorWithStatus({
        status: StatusCodes.BAD_REQUEST,
        message: 'This user did not request to adopt this pet'
      })
    }
    pet.isAdopted = true
    pet.adoptionRequests = []
    pet.owner = userId
    await pet.save()

    return pet
  }
}

module.exports = new PetService()
