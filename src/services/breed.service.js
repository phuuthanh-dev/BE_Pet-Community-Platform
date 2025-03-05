const Breed = require('../models/breed.model')

class BreedService {
  createBreed = async (name, description, image) => {
    const breed = await Breed.create({ name, description, image })
    return breed
  }
  getBreeds = async () => {
    const breeds = await Breed.find()
    return breeds
  }
}

module.exports = new BreedService()
