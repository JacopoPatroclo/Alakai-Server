const Sequelize = require('sequelize');
const DbSingleton = require('../lib/dbSetup');

const db = new DbSingleton().getInstace();

const Location = db.define('location', {
  slug: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  lat: {
    type: Sequelize.STRING,
  },
  lng: {
    type: Sequelize.STRING,
  },
  mayor: {
    type: Sequelize.NUMERIC,
  },
  minor: {
    type: Sequelize.NUMERIC,
  },
});

db.sync();

module.exports = Location;
