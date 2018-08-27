const Router = require('express').Router();
const Controller = require('./point.controller');
const { paramId } = require('../path/path.controller');
const { decodeToken, getFreshUser } = require('../../../auth');
const { validatePoint, validationLanguage } = require('../../../validation');

const isAuth = [decodeToken, getFreshUser];

Router.param('id', Controller.paramId);
Router.param('pathid', paramId);

Router.post('/', isAuth, validatePoint, Controller.post);
Router.put('/:id', isAuth, Controller.put);
Router.put('/:id/insert/:pathid', isAuth, Controller.insertIntoPath);
Router.delete('/:id', isAuth, Controller.delete);
Router.get('/', validationLanguage, Controller.getAll);
Router.get('/admin/:id', isAuth, Controller.getOneAdmin)
Router.get('/:id', validationLanguage, Controller.getOne);

module.exports = Router;
