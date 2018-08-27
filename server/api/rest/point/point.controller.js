const {
  Points,
  Languages,
  Location,
} = require('../../../models');
const HProm = require('../../../lib/happyProm');
const DbSingleton = require('../../../lib/dbSetup');
const { Op } = require('sequelize');
const { requestPoint, addPoint } = require('../../../lib/HooksComponent');
const { supportedLanguage } = require('../../../lib/language')

const db = new DbSingleton().getInstace();

const populateListOfPointForLanguage = (listOfData) => {
  return supportedLanguage().map(lng => {
    const findText = listOfData.find(data => data.language_code === lng.code)
    const text = findText ? findText.text : ''
    return {
      language_code: lng.code,
      text
    }
  })
}

async function createPoint(pointData) {
  if (pointData.images) { pointData.images = pointData.images.toString(); }
  pointData.description = populateListOfPointForLanguage(pointData.description)
  pointData.name = populateListOfPointForLanguage(pointData.name)
  pointData.info = populateListOfPointForLanguage(pointData.info)
  pointData.audio = populateListOfPointForLanguage(pointData.audio)

  return HProm(db.transaction(async (t) => {
    const point = await Points.create(pointData, { transaction: t });
    await Languages.bulkCreate(pointData.description.map(description =>
      ({ ...description, pointDescription: point.id })), { transaction: t });
    await Languages.bulkCreate(pointData.name.map(name =>
      ({ ...name, pointName: point.id })), { transaction: t });
    await Languages.bulkCreate(pointData.info.map(info =>
      ({ ...info, pointInfo: point.id })), { transaction: t });
    await Languages.bulkCreate(pointData.audio.map(audio =>
      ({ ...audio, pointAudio: point.id })), { transaction: t });
    const loaction = await Location.create({
      ...pointData.location,
      pointId: point.id,
    }, { transaction: t });
    return {
      ...point.dataValues,
      location: loaction.dataValues,
      description: pointData.description,
      name: pointData.name,
      info: pointData.info,
      audio: pointData.audio
    };
  }));
}

async function updatePoint(pointData) {
  if (pointData.images) { pointData.images = pointData.images.toString(); }
  return HProm(db.transaction(async (t) => {
    const point = await Points.update(pointData, { where: { id: pointData.id }, transaction: t });
    console.log(pointData)
    pointData.description.forEach(async desc => {
      await Languages.update(desc, {
        where: {
          pointDescription: pointData.id,
          language_code: desc.language_code
        }
      })
        .catch(err => { throw err })
    })

    pointData.name.forEach(async nam => {
      await Languages.update(nam, {
        where: {
          pointName: pointData.id,
          language_code: nam.language_code
        }
      })
        .catch(err => { throw err })
    })
    pointData.info.forEach(async inf => {
      await Languages.update(inf, {
        where: {
          pointInfo: pointData.id,
          language_code: inf.language_code
        }
      })
        .catch(err => { throw err })
    })
    pointData.audio.forEach(async aud => {
      await Languages.update(aud, {
        where: {
          pointAudio: pointData.id,
          language_code: aud.language_code
        }
      })
        .catch(err => { throw err })
    })
    
    const location = await Location.update({
      ...pointData.location,
      pointId: pointData.id,
    }, { where: { id: pointData.location.id } , transaction: t });
    return {
      ...point.dataValues,
      location: location.dataValues,
      description: pointData.description,
      name: pointData.name,
      info: pointData.info,
      audio: pointData.audio
    };
  }));
}

function riElaboratePoint(point) {
  if (point.images) { point.images = point.images.split(','); }
  return point
}

module.exports = {
  paramId: async (req, res, next, id) => {
    const point = await HProm(Points.findById(id));
    if (point.success) {
      if (point.data) {
        req.point = point.data;
        req.param.id = id;
        next();
      } else {
        next(new Error('No point with such id'));
      }
    } else {
      next(point.data);
    }
  },
  post: async (req, res, next) => {
    const createPointTransaction = await createPoint(req.body);

    if (createPointTransaction.success) {
      addPoint.trigger({
        point: createPointTransaction.data,
        request: req,
        success: createPointTransaction.success,
      });
      res.status(200).json(riElaboratePoint(createPointTransaction.data));
    } else {
      next(createPointTransaction.data);
    }
  },
  put: async (req, res, next) => {
    const updatePointTransaction = await updatePoint(req.body);
    if (updatePointTransaction.success) {
      res.status(200).json(riElaboratePoint(updatePointTransaction.data));
    } else {
      next(updatePointTransaction.data);
    }
  },
  insertIntoPath: async (req, res, next) => {
    const insertInPath = await HProm(Points.update({
      pathId: req.pathData.id,
      position: req.body.position || 0,
    }, {
      where: {
        id: req.point.id,
      },
    }));
    if (insertInPath.success) {
      res.status(200).json({
        pathId: req.pathData.id,
        pointId: req.point.id,
        position: req.body.position || 0,
      });
    } else {
      next(insertInPath.data);
    }
  },
  getAll: async (req, res, next) => {
    const pointsList = await HProm(Points.findAll({
      include: [{
        model: Languages,
        as: 'description',
        where: {
          language_code: req.query.lng,
        },
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
      }],
    }));
    if (pointsList.success) {
      res.status(200).json(pointsList.data);
    } else {
      next(pointsList.data);
    }
  },
  getOne: async (req, res, next) => {
    const point = await HProm(Points.findById(req.param.id, {
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
    if (point.success) {
      const resPoint = point.data ? point.data : { message: 'No point found for that language' };
      requestPoint.trigger({
        point: resPoint,
        request: req,
        success: point.success,
      });
      res.status(200).json(resPoint);
    } else {
      next(point.data);
    }
  },
  getOneAdmin: async (req, res, next) => {
    const point = await HProm(Points.findById(req.param.id, {
      include: [{
        model: Languages,
        as: 'description',
      }, {
        model: Languages,
        as: 'name',
      }, {
        model: Languages,
        as: 'info',
      }, {
        model: Languages,
        as: 'audio'
      }, {
        model: Location
      }],
    }));
    if (point.success) {
      const resPoint = point.data ? point.data : { message: 'No point found for that language' };
      res.status(200).json(riElaboratePoint(resPoint));
    } else {
      next(point.data);
    }
  },
  delete: async (req, res, next) => {
    const destroyOp = await HProm(db.transaction(async (t) => {
      await Points.destroy({
        where: {
          id: req.point.id,
        },
        transaction: t,
      });
      await Languages.destroy({
        where: {
          [Op.or]: [
            { pointDescription: req.point.id },
            { pointName: req.point.id },
            { pointInfo: req.point.id },
          ],
        },
        transaction: t,
      });
    }));
    if (destroyOp.success) {
      res.status(201).send();
    } else {
      next(destroyOp.data);
    }
  },
};
