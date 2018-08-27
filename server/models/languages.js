const Sequelize = require('sequelize');
const DbSingleton = require('../lib/dbSetup');
const { validationLanguage } = require('../lib/language');

const db = new DbSingleton().getInstace();

const Language = db.define('language', {
  language_code: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      ValidateLang(value) {
        validationLanguage(value);
      },
    },
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

db.sync();

module.exports = Language;
