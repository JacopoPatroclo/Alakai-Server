const Joi = require('joi');

const LanguageShema = {
  language_code: Joi.string().required(),
  text: Joi.string().max(500).required(),
  id: Joi.number(),
  createdAt: Joi.string(),
  updatedAt: Joi.string()
};

module.exports = {
  slug: Joi.string().min(3).max(10).required(),
  images: Joi.array().items(Joi.string()),
  audio: Joi.array().items(LanguageShema),
  location: {
    slug: Joi.string().min(3).max(10).required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },
  name: Joi.array().items(LanguageShema).required(),
  description: Joi.array().items(LanguageShema).required(),
  info: Joi.array().items(LanguageShema).required(),
};
