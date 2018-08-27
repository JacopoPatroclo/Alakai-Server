const config = require('../../../config')
const { languages } = require('../../../lib/language')

module.exports = {
  getLanguage: (req, res, next) => {
    res.status(200).json({ languages: languages.filter(lang => config.languages.find(language => language === lang.name)) })
  }
}