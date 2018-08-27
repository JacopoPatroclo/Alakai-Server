const Router = require('express').Router();
const Controller = require('./auth.controller');
const { verifyuser, decodeToken, getFreshUser } = require('./index');

Router.post('/signin', verifyuser, Controller.signIn);

Router.post('/validate', decodeToken, getFreshUser, Controller.validate);

module.exports = Router;
