require('dotenv').config();

module.exports = {
  db: {
    location: process.env.DATABASE_LOCATION,
    password: process.env.DATABASE_PASS,
    username: process.env.DATABASE_USERNAME,
    database: 'Alakai',
  },
  secrets: {
    jwt: process.env.JWT_SECRET,
  },
  cookie: {
    cookieName: 'XYZ_User',
    expiration: 1000 * 60 * 1
  }
};
