const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config');
const { User } = require('../models');
const { Op } = require('sequelize');
const HProm = require('../lib/happyProm');

const checkToken = expressJwt({ secret: config.secrets.jwt });

module.exports = {
  decodeToken: (req, res, next) => {
    if (req.query && req.query.access_token) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }
    checkToken(req, res, next);
  },
  decodeTokenInCookie: (redirectUrl) => {
    return (req, res, next) => {
      if (req.cookies && req.cookies[config.cookie.cookieName]) {
        req.headers.authorization = `Bearer ${req.cookies[config.cookie.cookieName]}`
        checkToken(req, res, next)
      } else {
        res.redirect(redirectUrl)
      }
    }
  },
  signToken: id =>
    jwt.sign(
      { _id: id },
      config.secrets.jwt,
      { expiresIn: config.jwt.expires },
    ),
  verifyuser: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ err: 'Nessuna email o password' });
    }

    const user = await HProm(User.findOne({
      where: {
        email: {
          [Op.like]: email,
        },
      },
    }));

    if (user.success) {
      if (!user.data) {
        res.status(401).json({ err: 'Nessun utente trovato, email errata' });
      } else {
        const authentication = await HProm(User.authenticate(password, user.data.password));
        if (authentication.success) {
          if (!authentication.data) {
            res.status(401).json({ err: 'Password errata' });
          } else {
            req.user = user.data;
            next();
          }
        } else {
          next(authentication.data);
        }
      }
    } else {
      next(user.data);
    }
  },
  getFreshUser: async (req, res, next) => {
    const { _id } = req.user;
    const user = await HProm(User.findOne({ where: { id: _id } }));
    if (!user.success) {
      res.status(401).json({ err: 'Nessun utente corrisponde a tale token' });
    } else {
      req.user = user.data;
      next();
    }
  },
  verifyuserProm: (email, password) => {
    return new Promise( async (resolve, reject) => {
      if (!email || !password) {
        reject('Nessuna email o password');
      }
  
      const user = await HProm(User.findOne({
        where: {
          email: {
            [Op.like]: email,
          },
        },
      }));
  
      if (user.success) {
        if (!user.data) {
          reject('Nessun utente trovato, email errata');
        } else {
          const authentication = await HProm(User.authenticate(password, user.data.password));
          if (authentication.success) {
            if (!authentication.data) {
              reject('Password errata');
            } else {
              resolve(user.data);
            }
          } else {
            reject(authentication.data);
          }
        }
      } else {
        reject(user.data);
      }
    })
  }
};
