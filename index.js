const app = require('./server');
const config = require('./server/config');
const logger = require('./server/log');

// METTO L'APPLICATIVO IN ASCOLTO
app.listen(config.port, () => {
  logger.log(logger.constant.levels.info, `App is on PORT ${config.port}`);
});

