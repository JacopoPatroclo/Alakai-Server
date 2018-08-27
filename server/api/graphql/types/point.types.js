const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Point',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    description: {
      type: GraphQLString,
    },
  }),
});
