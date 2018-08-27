require('dotenv').config();

module.exports = {
  db: {
    location: process.env.DATABASE_LOCATION,
    password: process.env.DATABASE_PASS,
    username: process.env.DATABASE_USERNAME,
    database: 'Alakai',
  },
  secrets: {
    jwt: 'An amazin secret',
  },
  // in development override the alakai configuration
  server: {
    domain: 'http://localhost:3000',
  },
  jwt: {
    expires: 60 * 60,
  },
  cookie: {
    cookieName: 'Auth_user',
    expiration: 1000 * 60 * 2
  }
};
