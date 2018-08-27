const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const query = require('./query');
const mutation = require('./mutations');

// SETUP DELLO SCHEMA GENERALE
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: query,
  }),
  mutation: new GraphQLObjectType({
    name: 'mutations',
    fields: mutation,
  }),
});
