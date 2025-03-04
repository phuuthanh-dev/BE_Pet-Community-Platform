const AdoptionForm = require('../models/adoptionForm.model')

class AdoptionFormRepoSitory {
  getAll = async (filter, options) => {
    return await AdoptionForm.paginate(filter, options)
  }
}

module.exports = new AdoptionFormRepoSitory()
