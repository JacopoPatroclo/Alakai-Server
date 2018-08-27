const {
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const { PointType } = require('../types');
const { points } = require('../../../models');

module.exports = {
  type: PointType,
  args: {
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (root, args) => {
    const createdPoint = await points.create(args, { returning: true });
    return createdPoint;
  },
};
