const Joi = require('joi')

const addNewPet = {
  body: Joi.object().keys({
    name: Joi.string().max(32).required(),
    breed: Joi.string().max(32).required(),
    age: Joi.number().min(0).required(),
    health_status: Joi.string().valid('Healthy', 'Sick', 'Recovering', 'Injured').required(),
    description: Joi.string().max(500).required(),
    image_url: Joi.array().items(Joi.string().uri()),
    size: Joi.string().max(32).required(),
    coat: Joi.string().max(32).required(),
    temperament: Joi.string().max(32).required(),
    vaccinated: Joi.boolean().required(),
    submittedBy: Joi.string().optional().default(null),
    owner: Joi.string().optional().default(null)
  })
}

const updatePet = {
  body: Joi.object().keys({
    name: Joi.string().max(32).optional(),
    breed: Joi.string().max(32).optional(),
    age: Joi.number().min(0).optional(),
    health_status: Joi.string().valid('Healthy', 'Sick', 'Recovering', 'Injured').optional(),
    description: Joi.string().max(500).optional(),
    image_url: Joi.array().items(Joi.string().uri()),
    size: Joi.string().max(32).optional(),
    coat: Joi.string().max(32).optional(),
    temperament: Joi.string().max(32).optional(),
    vaccinated: Joi.boolean().optional(),
    submittedBy: Joi.string().optional().default(null),
    owner: Joi.string().optional().default(null)
  })
}

module.exports = {
  addNewPet,
  updatePet
}
