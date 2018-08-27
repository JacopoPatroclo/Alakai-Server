const logger = require('../log');
/* eslint-disable */
module.exports = (err, req, res, next) => {
  switch (err.code) {
    case 'credentials_required':
      res.status(401).json(err.inner);
      logger.log(logger.constant.levels.warn, err);
      break;

    default:
      res.status(500).json({
        err: err.message,
      });
      logger.log(logger.constant.levels.error, err);
      break;
  }
};

