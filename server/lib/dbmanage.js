const { admin } = require('../config');
const logger = require('../log');

const defaultCredential = {
  email: 'admin@admin.com',
  password: 'Test123',
};

module.exports = {
  setupDefaultAdmin: async (User) => {
    const credential = admin ? admin.default : defaultCredential;
    if (!admin) {
      logger.log(logger.constant.levels.warn, 'No credential passed in alakai.config.json, using the default');
    }
    try {
      let adminDefault = await User.findOne({
        where: {
          email: credential.email,
        },
      });
      if (!adminDefault) {
        adminDefault = User.create(credential);
      }
      return adminDefault.dataValues;
    } catch (err) {
      return err;
    }
  },
};
