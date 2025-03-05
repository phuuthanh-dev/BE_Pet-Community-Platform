const { OK, CREATED } = require("../configs/response.config")
const breedService = require("../services/breed.service")
const catchAsync = require("../utils/catchAsync")

class BreedController {
  createBreed =  catchAsync(async (req, res) => {
    const { name, description, image } = req.body
    const breed = await breedService.createBreed(name, description, image)
    return CREATED(res, 'Breed created successfully', breed)
  })
  getBreeds = catchAsync(async (req, res) => {
    const breeds = await breedService.getBreeds()
    return OK(res, 'Breeds fetched successfully', breeds)
  })
}

module.exports = new BreedController()
