const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const { setupDefaultAdmin } = require('../lib/dbmanage');
const logger = require('../log');
const { validationLanguage } = require('../lib/language');
const DbSingleton = require('../lib/dbSetup');

const db = new DbSingleton().getInstace();

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: 'en',
    validate: {
      ValidateLang(value) {
        validationLanguage(value);
      },
    },
  },
}, {
  hooks: {
    /* eslint-disable */
    beforeCreate: user =>
      bcrypt.hash(user.password, 10).then((hashedPw) => {
        user.password = hashedPw;
      }),
    beforeBulkUpdate: ({ attributes }) => {
      if (attributes.password) {
        return bcrypt.hash(attributes.password, 10).then((hashedPw) => {
          attributes.password = hashedPw;
        });
      }
      return true;
    },
  },
});

db.sync()
  .then(() => setupDefaultAdmin(User))
  .catch(err => logger.log(logger.constant.levels.error, err))

User.authenticate = (plainPass, hashPass) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPass, hashPass, function (err, match) {
      if (err) {
        reject(err);
      } else {
        resolve(match);
      }
    })
  })
}

module.exports = User;
