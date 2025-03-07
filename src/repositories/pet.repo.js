const Pet = require("../models/pet.model")

class PetRepoSitory {
  getAll = async (filter, options) => {
    return await Pet.paginate(filter, options)
  }
}

module.exports = new PetRepoSitory()
