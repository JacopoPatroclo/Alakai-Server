const Sequelize = require('sequelize');
const DbSingleton = require('../lib/dbSetup');
const Language = require('./languages');
const Point = require('./point');

const db = new DbSingleton().getInstace();

const Path = db.define('path', {
  slug: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  images: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },
  audio: {
    type: Sequelize.STRING,
  },
});

Path.hasMany(Language, { foreignKey: 'pathDescription', as: 'description' });
Path.hasMany(Language, { foreignKey: 'pathName', as: 'name' });
Path.hasMany(Language, { foreignKey: 'pathtInfo', as: 'info' });

Path.hasMany(Point);

db.sync();

module.exports = Path;
