const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const PetController = require('../controllers/pet.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const validate = require('../middlewares/validate.middleware')
const PetValidation = require('../validation/pet.validation.js')

const router = express.Router()

router.post('/add', isAuthenticated, validate(PetValidation.addNewPet), upload.array('media'), PetController.addNewPet)
router.post(
  '/update',
  isAuthenticated,
  validate(PetValidation.updatePet),
  upload.array('media'),
  PetController.updatePet
)
router.delete('/delete/:id', PetController.deletePet, isAuthenticated)
router.post(
  '/submit',
  isAuthenticated,
  upload.array('media'),
  validate(PetValidation.addNewPet),
  PetController.submitPet
)
router.post('/approve/:petId', isAuthenticated, PetController.adminApprovePet)
router.post('/adopt/:petId', isAuthenticated, PetController.userAdoptPet)
router.post('/request/:petId', isAuthenticated, PetController.requestAdoptPet)

module.exports = router
