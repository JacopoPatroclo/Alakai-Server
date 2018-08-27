const Router = require('express').Router();
const Controller = require('./settings.controller');
const { decodeToken, getFreshUser } = require('../../../auth');

Router.get('/languages', decodeToken, getFreshUser, Controller.getLanguage)

module.exports = Router;
