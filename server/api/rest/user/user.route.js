const Router = require('express').Router();
const Controller = require('./user.controlle');
const { decodeToken, getFreshUser } = require('../../../auth');

Router.put('/', decodeToken, getFreshUser, Controller.put)

Router.get('/', decodeToken, getFreshUser, Controller.get)

Router.post('/', decodeToken, getFreshUser, Controller.post)

module.exports = Router;
