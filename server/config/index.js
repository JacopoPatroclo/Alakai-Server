require('dotenv').config();

const alakaiConf = require('../../alakai.config.json');

const baseConf = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  production: 'production',
  development: 'development',
  test: 'test',
  files: {
    pathSave: '/server/uploads',
  },
};

let envConf = {};
try {
  /* eslint-disable */
  envConf = require('./' + baseConf.env);
} catch (error) {
  console.log(error);
  /* eslint-disable */
}

module.exports = {
  ...baseConf,
  ...alakaiConf,
  ...envConf,
};
