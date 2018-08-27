const Multer = require('multer');
const path = require('path');
const config = require('../config');

const PathWhereSave = config.files.pathSave;

// SETUP MULTER IMAGES
const multerImage = Multer({
  dest: `.${PathWhereSave}`,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
});

// SETUP MULTER AUDIO
const multerAudio = Multer({
  dest: `.${PathWhereSave}`,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp3') {
      callback(new Error('Only audio file are allowed'));
    }
    callback(null, true);
  },
});

module.exports = {
  multerAudio,
  multerImage,
};
