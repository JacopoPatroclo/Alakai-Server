const graphqlHTTP = require('express-graphql');
const Router = require('express').Router();

const schema = require('./schema');
const config = require('../../config');

// ESPORTAZIONE NELLA ROUTE DI BASE PER LO SCHEMA
Router.use('/', graphqlHTTP({
  schema,
  // ATTIVAZIONE DELL'INTERFACCIA GRAFICA DI GRAPHQL SOLO SE IN DEV
  graphiql: config.env === config.development,
}));

module.exports = Router;
