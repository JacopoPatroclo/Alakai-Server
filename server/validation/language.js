const Joi = require('joi');
const { languages } = require('../lib/language');
const config = require('../config');

module.exports = Joi.object().keys({
  lng: Joi.any().valid(languages.filter(lngObj =>
    config.languages.includes(lngObj.name))
    .map(lngObj => lngObj.code)).required(),
});
