const PointSchema = require('./point');
const PathSchema = require('./path');
const LanguageSchema = require('./language');
const Joy = require('joi');

module.exports = {
  validatePoint: (req, res, next) => {
    const validationResult = Joy.validate(req.body, PointSchema);
    if (validationResult.error) {
      next(validationResult.error);
    } else {
      next();
    }
  },
  validatePath: (req, res, next) => {
    const validationResult = Joy.validate(req.body, PathSchema);
    if (validationResult.error) {
      next(validationResult.error);
    } else {
      next();
    }
  },
  validationLanguage: (req, res, next) => {
    const validationResult = Joy.validate(req.query, LanguageSchema);
    if (validationResult.error) {
      next(validationResult.error);
    } else {
      next();
    }
  },
};
