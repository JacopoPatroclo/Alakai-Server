const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

const { PointType } = require('../types');
const { points } = require('../../../models');

module.exports = {
  type: PointType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (root, args) => {
    const pointFound = await points.findById(args.id);
    if (!pointFound) { throw new Error('Nessun id trovato'); }
    return pointFound.dataValues;
  },
};
