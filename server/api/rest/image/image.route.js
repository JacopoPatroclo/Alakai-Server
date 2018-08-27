const Router = require('express').Router();
const { decodeToken, getFreshUser } = require('../../../auth');
const { loadFileTo, getFile } = require('../../../massStorage');

const isAuth = [decodeToken, getFreshUser];
const TipologyFile = 'images';
const routeTo = `/api/rest/${TipologyFile}`;

Router.param('name', (req, res, next, name) => {
  req.imageName = name;
  next();
});

Router.post('/', isAuth, loadFileTo(TipologyFile, 'image'), (req, res) => {
  res.status(200).json({
    fileName: `${routeTo}/${req.body.image}`,
  });
});

Router.get('/:name', async (req, res, next) => {
  const file = await getFile(TipologyFile, req.imageName);
  if (file.error) { next(file.error); return }
  res.writeHead(200, {
    'Content-Length': file.info.size,
  });
  file.stream.pipe(res)
    .on('error', (err) => {
      next(err);
    });
});

module.exports = Router;
