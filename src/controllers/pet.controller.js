const catchAsync = require('../utils/catchAsync')
const { OK, CREATED } = require('../configs/response.config')
const APIError = require('../utils/APIError')
const petService = require('../services/pet.service')
const cloudinaryService = require('../utils/cloudinary')

class PetController {
  addNewPet = catchAsync(async (req, res) => {
    const { petData } = req.body
    const image_url = req.file
    const imagelUrl = await cloudinaryService.uploadImage(image_url.buffer)
    const newPet = await petService.createPet(petData, imagelUrl)
    return CREATED(res, 'Pet added successfully', newPet)
  })

  updatePet = catchAsync(async (req, res) => {
    const updatedPet = await petService.updatePet(req.body)
    return OK(res, 'Pet updated successfully', updatedPet)
  })
  deletePet = catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedPet = await petService.deletePet(id)

    return OK(res, 'Pet deleted successfully', deletedPet)
  })
  submitPet = catchAsync(async (req, res) => {
    if (!req.file) {
      throw new APIError(400, 'No file uploaded')
    }
    const image_url = req.file
    const imagelUrl = await cloudinaryService.uploadImage(image_url.buffer)
    const pet = await petService.submitPet(req.id, req.body, imagelUrl)
    return CREATED(res, 'Pet submitted successfully, pending approval', pet)
  })
  adminApprovePet = catchAsync(async (req, res) => {
    const pet = await petService.approvePet(req.params.petId)
    return OK(res, 'Pet approved successfully', pet)
  })
  requestAdoptPet = catchAsync(async (req, res) => {
    const pet = await petService.requestAdoption(req.id, req.params.petId)
    return OK(res, 'Adoption request sent successfully', pet)
  })
  userAdoptPet = catchAsync(async (req, res) => {
    const pet = await petService.adoptPet(req.id, req.params.petId)
    return OK(res, 'Pet adopted successfully', pet)
  })
}

module.exports = new PetController()
