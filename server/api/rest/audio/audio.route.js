const Router = require('express').Router();
const { decodeToken, getFreshUser } = require('../../../auth');
const { loadFileTo, getFile } = require('../../../massStorage');

const isAuth = [decodeToken, getFreshUser];
const TipologyFile = 'audio';
const routeTo = `/api/rest/${TipologyFile}`;

Router.param('name', (req, res, next, name) => {
  req.audioName = name;
  next();
});

Router.post('/', isAuth, loadFileTo(TipologyFile, 'audio'), (req, res) => {
  res.status(200).json({
    fileName: `${routeTo}/${req.body.audio}`,
  });
});

Router.get('/:name', async (req, res, next) => {
  const file = await getFile(TipologyFile, req.audioName);
  if (file.error) { next(file.error); return }
  const { range } = req.headers;
  if (range) {
    let [start, end] = range.replace(/bytes=/, '').split('-');
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : file.info.size - 1;
    res.writeHead(206, {
      'Content-Length': (end - start) + 1,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${file.info.size}`,
    });
    const fileCut = await getFile(TipologyFile, req.audioName, { start, end });
    fileCut.stream.pipe(res)
      .on('error', (err) => {
        next(err);
      });
  } else {
    res.writeHead(200, {
      'Content-Length': file.info.size,
    });
    file.stream.pipe(res)
      .on('error', (err) => {
        next(err);
      });
  }
});

module.exports = Router;
