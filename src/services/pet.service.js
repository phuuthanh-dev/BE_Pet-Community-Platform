const Pet = require('../models/pet.model')
const mongoose = require('mongoose')
const APIError = require('../utils/APIError')

class PetService {
  async createPet(petData) {
    try {
      const newPet = await Pet.create({
        ...petData,
        isApproved: true
      })
      return newPet
    } catch (error) {
      console.error('Error creating pet:', error)
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message)
        throw new APIError(400, 'Validation Error', errors)
      }
      throw new APIError(500, 'Error adding pet', error.stack)
    }
  }
  async updatePet(petData) {
    const { id, ...updateData } = petData

    if (!id) {
      throw new APIError(400, 'Pet ID is required for update')
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError(400, 'Invalid Pet ID format')
    }

    const updatedPet = await Pet.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedPet) {
      throw new APIError(404, 'Pet not found with the given ID')
    }

    return updatedPet
  }
  async deletePet(petId) {
    try {
      if (!petId) {
        throw new APIError(400, 'Pet ID is required')
      }

      const deletedPet = await Pet.findByIdAndDelete(petId)
      if (!deletedPet) {
        throw new APIError(404, 'Pet not found')
      }

      return deletedPet
    } catch (error) {
      if (error.name === 'CastError') {
        throw new APIError(400, 'Invalid Pet ID format')
      }
      throw new APIError(500, 'Error deleting pet', error.stack)
    }
  }
  async submitPet(userId, petData) {
    if (!userId) {
      throw new APIError(400, 'User ID is required')
    }

    const newPet = await Pet.create({
      ...petData,
      submittedBy: userId,
      owner: userId,
      isApproved: false
    })

    return newPet
  }
  async approvePet(petId) {
    const pet = await Pet.findById(petId)
    if (!pet) {
      throw new APIError(404, 'Pet not found')
    }

    if (pet.isApproved) {
      throw new APIError(400, 'Pet is already approved')
    }

    pet.owner = null
    pet.isApproved = true
    await pet.save()

    return pet
  }
  async requestAdoption(userId, petId) {
    if (!userId || !petId) {
      throw new APIError(400, 'User ID and Pet ID are required')
    }

    const pet = await Pet.findById(petId)
    if (!pet) {
      throw new APIError(404, 'Pet not found')
    }
    if (!pet.isApproved) {
      throw new APIError(400, 'Pet is not available for adoption')
    }
    if (pet.isAdopted) {
      throw new APIError(400, 'Pet has already been adopted')
    }

    if (pet.adoptionRequests.includes(userId)) {
      throw new APIError(400, 'You have already requested to adopt this pet')
    }

    pet.adoptionRequests.push(userId)
    await pet.save()

    return pet
  }

  async adoptPet(userId, petId) {
    const pet = await Pet.findById(petId)
    if (!pet) {
      throw new APIError(404, 'Pet not found')
    }

    if (!pet.isApproved) {
      throw new APIError(400, 'Pet is not available for adoption')
    }
    if (pet.isAdopted) {
      throw new APIError(400, 'Pet has already been adopted')
    }

    if (pet.owner) {
      throw new APIError(400, 'Pet has already been adopted')
    }
    if (!pet.adoptionRequests.includes(userId)) {
      throw new APIError(400, 'This user did not request to adopt this pet')
    }
    pet.isAdopted = true
    pet.adoptionRequests = []
    pet.owner = userId
    await pet.save()

    return pet
  }
}

module.exports = new PetService()
