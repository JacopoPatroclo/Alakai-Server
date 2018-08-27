const api = require('express').Router();
const graphql = require('./graphql');
const rest = require('./rest');
const { setupLanguageContext } = require('../localize');

// ROUTE PER LE API IN GRAPHQL
api.use('/grql', graphql);

// ROUTE BASE PER LE API REST
api.use('/rest', setupLanguageContext, rest);

module.exports = api;
