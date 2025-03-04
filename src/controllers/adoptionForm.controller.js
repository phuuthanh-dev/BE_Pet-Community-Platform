const adoptionFormRepo = require('../repositories/adoptonForm.repo')
const catchAsync = require('../utils/catchAsync')
const { CREATED, OK } = require('../configs/response.config')
const { ADOPTION_FORM_MESSAGE } = require('../constants/messages')
const AdoptionForm = require('../models/adoptionForm.model')
const User = require('../models/user.model')
const AdoptionPost = require('../models/adoptionPost.model')
const { ADOPTION_POST_STATUS } = require('../constants/enums')

class AdoptionFormController {
  createAdoptionForm = catchAsync(async (req, res) => {
    const { adoptionPost, pet, user, adopter, message } = req.body

    // Optional: Verify that the user exists and is valid
    const adopterUser = await User.findById(user)
    if (!adopterUser) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }
    const currentAdoptPost = await AdoptionPost.findById(adoptionPost)
    if (!currentAdoptPost) {
      return res.status(400).json({ message: 'Invalid adoption post ID' })
    }

    const adoptionForm = new AdoptionForm({
      adoptionPost,
      pet,
      user,
      adopter,
      message
    })

    const savedForm = await adoptionForm.save()
    currentAdoptPost.adopt_status = ADOPTION_POST_STATUS.PENDING
    return CREATED(res, ADOPTION_FORM_MESSAGE.CREATED_SUCCESS, savedForm)
  })

  // Get all adoption forms
  async getAll(req, res) {
    const { sortBy, limit, page, q, status, ...filters } = req.query

    const options = {
      sortBy: sortBy || 'createdAt',
      limit: limit ? parseInt(limit) : 5,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ['message'],
      q: q ?? '',
      populate: 'adoptionPost,pet,user'
    }

    if (status) {
      filters.status = status
    }

    const adoptionForms = await adoptionFormRepo.getAll(filters, options)
    return OK(res, ADOPTION_FORM_MESSAGE.FETCH_ALL_SUCCESS, adoptionForms)
  }

  // Get single adoption form
  //   async getById(req, res) {
  //     const { id } = req.params
  //     const adoptionForm = await adoptionFormRepo.getById(id)

  //     if (!adoptionForm) {
  //       throw new NotFoundError('Adoption form not found')
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: adoptionForm
  //     })
  //   }

  // Update adoption form
  //   async update(req, res) {
  //     const { id } = req.params
  //     const updateData = req.body

  //     const adoptionForm = await adoptionFormRepo.update(id, updateData)
  //     if (!adoptionForm) {
  //       throw new NotFoundError('Adoption form not found')
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: adoptionForm
  //     })
  //   }

  // Delete adoption form
  //   async delete(req, res) {
  //     const { id } = req.params
  //     const adoptionForm = await adoptionFormRepo.delete(id)

  //     if (!adoptionForm) {
  //       throw new NotFoundError('Adoption form not found')
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: 'Adoption form deleted successfully'
  //     })
  //   }
}

module.exports = new AdoptionFormController()
