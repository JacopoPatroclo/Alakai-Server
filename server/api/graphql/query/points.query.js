const {
  GraphQLList,
} = require('graphql');
const { PointType } = require('../types');
const { points } = require('../../../models');

module.exports = {
  type: GraphQLList(PointType),
  resolve: async () => {
    const pointFound = await points.findAll();
    return pointFound;
  },
};
