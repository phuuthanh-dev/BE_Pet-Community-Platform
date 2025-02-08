const AdoptionPost = require('../models/adoptionPost.model')

class AdoptionPostRepoSitory {
  getAll = async (filter, options) => {
    return await AdoptionPost.paginate(filter, options)
  }
}

module.exports = new AdoptionPostRepoSitory()
