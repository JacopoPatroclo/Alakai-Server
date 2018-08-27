const Sequelize = require('sequelize');
const DbSingleton = require('../lib/dbSetup');

const db = new DbSingleton().getInstace();

const Language = require('./languages');
const Location = require('./location');

const Point = db.define('point', {
  slug: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  images: {
    type: Sequelize.STRING,
  }
});

Point.hasMany(Language, { foreignKey: 'pointDescription', as: 'description' });
Point.hasMany(Language, { foreignKey: 'pointName', as: 'name' });
Point.hasMany(Language, { foreignKey: 'pointInfo', as: 'info' });
Point.hasMany(Language, { foreignKey: 'pointAudio', as: 'audio' });

Point.hasOne(Location);

db.sync();

module.exports = Point;
