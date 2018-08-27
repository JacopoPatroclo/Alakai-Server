const language = require('./language.json');

// Il contesto che guida la traduzione
let context = 'en';

module.exports = {
  setupLanguageContext: (req, res, next) => {
    context = req.query.lng ? req.query.lng.toLowerCase() : 'en';
    next();
  },
  localize: (key) => {
    if (language[context]) {
      return language[context][key] ? language[context][key] : 'No translation aviable';
    }
    return 'No language aviable';
  },
};
