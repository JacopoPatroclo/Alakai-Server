const Router = require('express').Router();
const Controller = require('./path.controller');
const { decodeToken, getFreshUser } = require('../../../auth');
const { validatePath, validationLanguage } = require('../../../validation');

const isAuth = [decodeToken, getFreshUser];

Router.param('id', Controller.paramId);

Router.post('/', isAuth, validatePath, Controller.post);
Router.put('/:id', isAuth, validatePath, Controller.put);
Router.delete('/:id', isAuth, Controller.delete);
Router.get('/', validationLanguage, Controller.getAll);
Router.get('/:id', validationLanguage, Controller.getOne);

module.exports = Router;
