const Joi = require('joi');

const LanguageShema = {
  language_code: Joi.string().required(),
  text: Joi.string().max(25).required(),
};

module.exports = {
  slug: Joi.string().min(3).max(10).required(),
  image: Joi.string().uri(),
  audio: Joi.string().uri(),
  names: Joi.array().items(LanguageShema).required(),
  descriptions: Joi.array().items(LanguageShema).required(),
  infos: Joi.array().items(LanguageShema).required(),
};
