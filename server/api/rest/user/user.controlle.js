const { User } = require('../../../models');
const HProm = require('../../../lib/happyProm');

module.exports = {
  put: async (req, res, next) => {
    const update = await HProm(User.update(req.body, {
      where: {
        id: req.user.id,
      },
    }));
    if (update.success) {
      res.status(201).send();
    } else {
      next(update.data);
    }
  },
  get: (req, res, next) => {
    res.status(200).json(req.user)
  },
  post: async (req, res, next) => {
    const create = await HProm(User.create(req.body));
    if (create.success) {
      res.status(200).json(create.data);
    } else {
      next(create.data);
    }
  }
};
