const catchAsync = require('../utils/catchAsync')
const { OK, CREATED } = require('../configs/response.config')
const APIError = require('../utils/APIError')
const petService = require('../services/pet.service')

class PetController {
  addNewPet = catchAsync(async (req, res) => {
    const newPet = await petService.createPet(req.body)
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
    console.log(req.id)
    const pet = await petService.submitPet(req.id, req.body)
    return OK(res, 'Pet submitted successfully, pending approval', pet)
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
