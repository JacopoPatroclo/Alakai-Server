const Router = require('express').Router();

// const { decodeToken, getFreshUser } = require('../../auth');
const User = require('./user/user.route');
const Point = require('./point/point.route');
const Path = require('./path/path.route');
const Images = require('./image/image.route');
const Audio = require('./audio/audio.route');
const Settings = require('./settings/settings.route');

Router.use('/user', User);
Router.use('/point', Point);
Router.use('/path', Path);
Router.use('/images', Images);
Router.use('/audio', Audio);
Router.use('/settings', Settings);

module.exports = Router;
