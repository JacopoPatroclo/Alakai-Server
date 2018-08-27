const conf = require('../config');
const constant = require('./static');
const color = require('colors/safe');
const fs = require('fs');
const path = require('path');

/* eslint-disable */
function logOnFile(message) {
  const now = new Date();
  const mess = `TIMESTAMP: ${now.toISOString()} MESSAGE: ${message} \n\n`;
  fs.appendFile(path.resolve('main.log'), mess, { encoding: 'utf8' }, (err) => {
    err? logOnConsole(createMessage(constant.levels.error, err)) : (f) => f;
  });
}

function logOnConsole(message) {
  console.log(message)
  /* eslint-disable */
}

function createMessage (level, message) {
  const now = new Date()
  const mess = `TIMESTAMP: ${now.toISOString()} MESSAGE: ${message}`
  switch (level) {
    case constant.levels.error:
      return color.bold.red(mess)
      break;
    case constant.levels.warn:
      return color.yellow(mess)
      break;
    case constant.levels.info:
      return color.cyan(mess)
      break;
    case constant.levels.verbose:
      return color.italic.grey(mess)
      break;
    case constant.levels.debug:
      return color.white(mess)
      break;
    case constant.levels.silly:
      return color.green(mess)
      break;
    default:
      return mess
      break;
  }
}

module.exports = {
  log: (level = constant.levels.debug, message) => {
    const mess = createMessage(level, message)
    switch (level) {
      case constant.levels.error:
        logOnConsole(mess)
        if (conf.env === conf.production) {
          logOnFile(message)
        }
        break;
      case constant.levels.warn:
        logOnConsole(mess)
        if (conf.env === conf.production) {
          logOnFile(message)
        }
        break;
      case constant.levels.info:
        logOnConsole(mess)
        break;
      case constant.levels.verbose:
        if (conf.env === conf.development) {
          logOnConsole(mess)
        }
        break;
      case constant.levels.debug:
        if (conf.env === conf.development) {
          logOnConsole(mess)
        }
        break;
      case constant.levels.silly:
        if (conf.env === conf.development) {
          logOnConsole(mess)
        }
        break;
      default:
        console.log(mess)
        break;
    }
  }
}