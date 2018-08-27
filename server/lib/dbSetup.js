const Sequelize = require('sequelize');
const logger = require('../log');
const fs = require('fs');

const config = require('../config');

// create the database file
fs.appendFileSync(config.db.location, '');

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      this.instance =
        new Sequelize(config.db.database, config.db.username, config.db.password, {
          dialect: 'sqlite',
          storage: config.db.location,
          operatorsAliases: false,
          logging: logmsg => logger.log(logger.constant.levels.debug, logmsg),
        });
    }
  }
  getInstace() {
    return this.instance;
  }
}

module.exports = Singleton;
