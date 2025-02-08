const adoptionPostRepo = require('../repositories/adoptionPost.repo.js')
const AdoptionPost = require('../models/adoptionPost.model.js')

class AdoptionPostService {
  constructor() {
    this.post = AdoptionPost
  }
  getAllPost = async (query) => {
    const { sortBy, limit, page, q } = query
    const filter = { isHidden: false }
    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 5,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['caption'],
      q: q ?? '',
      populate: 'author'
    }

    return await adoptionPostRepo.getAll(filter, options)
  }
}

const adoptionPostService = new AdoptionPostService()
module.exports = adoptionPostService
