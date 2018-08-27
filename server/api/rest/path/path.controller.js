const {
  Path,
  Languages,
} = require('../../../models');
const HProm = require('../../../lib/happyProm');
const DbSingleton = require('../../../lib/dbSetup');
// const { Op } = require('sequelize');
// const { requestPoint, addPoint } = require('../../../lib/HooksComponent');

const db = new DbSingleton().getInstace();

module.exports = {
  paramId: async (req, res, next, id) => {
    const path = await HProm(Path.findById(id));
    if (path.success) {
      if (path.data) {
        req.pathData = path.data;
        req.param.id = id;
        next();
      } else {
        next(new Error('No path with such id'));
      }
    } else {
      next(path.data);
    }
  },
  post: async (req, res, next) => {
    const PathCreation = await HProm(db.transaction(async (t) => {
      const path = await Path.create(req.body, { transaction: t });
      await Languages.bulkCreate(req.body.descriptions.map(description =>
        ({ ...description, pathDescription: path.id })), { transaction: t });
      await Languages.bulkCreate(req.body.names.map(name =>
        ({ ...name, pathName: path.id })), { transaction: t });
      await Languages.bulkCreate(req.body.infos.map(info =>
        ({ ...info, pathInfo: path.id })), { transaction: t });
      return path;
    }));
    if (PathCreation.success) {
      res.status(200).json(PathCreation.data);
    } else {
      next(PathCreation.data);
    }
  },
  put: async (req, res, next) => {
    const PathUpdate = await HProm(Path.update(req.body, { where: { id: req.param.id } }));
    if (PathUpdate.success) {
      res.status(200).json(PathUpdate.data);
    } else {
      next(PathUpdate.data);
    }
  },
  getAll: async (req, res, next) => {
    const PathGet = await HProm(Path.findAll({
      where: req.filters,
      include: [{
        model: Languages,
        as: 'description',
        where: {
          language_code: req.query.lng,
        },
        required: false,
      }, {
        model: Languages,
        as: 'name',
        where: {
          language_code: req.query.lng,
        },
      }, {
        model: Languages,
        as: 'info',
        where: {
          language_code: req.query.lng,
        },
        required: false,
      }],
    }));
    if (PathGet.success) {
      const resPath = PathGet.data ? PathGet.data : { message: 'No path found for that language' };
      res.status(200).json(resPath);
    } else {
      next(PathGet.data);
    }
  },
  getOne: async (req, res, next) => {
    const PathGet = await HProm(Path.findById(req.param.id, {
      include: [{
        model: Languages,
        as: 'description',
        where: {
          language_code: req.query.lng,
        },
        required: false,
      }, {
        model: Languages,
        as: 'name',
        where: {
          language_code: req.query.lng,
        },
      }, {
        model: Languages,
        as: 'info',
        where: {
          language_code: req.query.lng,
        },
        required: false,
      }],
    }));
    if (PathGet.success) {
      const resPath = PathGet.data ? PathGet.data : { message: 'No path found for that language' };
      res.status(200).json(resPath);
    } else {
      next(PathGet.data);
    }
  },
  delete: async (req, res, next) => {
    const deletePath = await HProm(Path.destroy({
      where: req.param.id,
    }));
    if (deletePath.success) {
      res.status(204).send();
    } else {
      next(deletePath.data);
    }
  },
};
