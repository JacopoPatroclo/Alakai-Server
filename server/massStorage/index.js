const fs = require('fs');
const path = require('path');
const { multerAudio, multerImage } = require('./multer.config');
const config = require('../config');

// Get file stat helper function
function getFileStats(path) {
  return new Promise((resolve) => {
    fs.stat(path, (error, stats) => {
      if (error) resolve({success: false, data: error})
      resolve({success: true, data: stats})
    })
  })
}

// DEFAULT LOCATION AND TIPOLOGY
const TipologyFile = ['images', 'audio'];
const PathWhereSave = config.files.pathSave;
const projectBasePath = path.join(__dirname, '..', '..');
const routeTo = '/api/rest'

// GENERATION OF THE DIR
if (!fs.existsSync(path.join(projectBasePath, PathWhereSave))) {
  fs.mkdirSync(path.join(projectBasePath, PathWhereSave));
}

TipologyFile.forEach((name) => {
  if (!fs.existsSync(path.join(projectBasePath, PathWhereSave, name))) {
    fs.mkdirSync(path.join(projectBasePath, PathWhereSave, name));
  }
});

// METHODS
// Delete a file from the memory, is a function factory
const deleteFileFactory = pathToFile => () => new Promise((resolve, reject) => {
  fs.unlink(pathToFile, (err) => {
    if (err) { reject(err); } else { resolve(); }
  });
});

/*
  The load file middleware, combine the middelware from multer and
  the actual middleware for saving file depends on the tipology
*/
const loadFileTo = (typology, nameField) => [typology === 'images' ?
  multerImage.single(nameField) :
  multerAudio.single(nameField), (req, res, next) => {
  if (req.file) {
    const Filename = `${Date.now()}-${req.file.originalname}`;
    const pathFrom = path.resolve(projectBasePath, req.file.path);
    const pathTo = path.join(projectBasePath, req.file.destination, typology, Filename);
    req.body[nameField] = Filename;
    req.revertFile = deleteFileFactory(pathTo);
    fs.rename(
      pathFrom, pathTo,
      (err) => {
        if (err) {
          next(err);
        } else {
          next();
        }
      },
    );
  }
}];

// ad utility function that return a Promisie<Buffer> of the requested file
const getFile = async (tipology, Filename, cutStreamOption) => {
  const filePath = path.join(projectBasePath, PathWhereSave, tipology, Filename);
  const info = await getFileStats(filePath)
  if (info.success) {
    return {
      stream: fs.createReadStream(filePath, cutStreamOption),
      info: info.data
    };
  } else {
    return {
      error: new Error('Il file richiesto non esiste')
    }
  }
};

// creo ricorsivamente il nome del file e uso gli helper sopra per salvarlo nella cartella corrispondente,
// ritornando una lista di path da salvare in un oggetto con chiave images se la ripologia è immagini
// e audio se la tipologia è audio
function saveArrayOfFiles(typology, listOfFiles) {
  return new Promise((resolve) => {
    if (typeof listOfFiles !== 'object' && listOfFiles.length > 0) {
      resolve({ success: false, error: new Error('ListOfFiles non è un array con valori') });
      return
    }
    let countSuccess = listOfFiles.length
    let listOfPath = []
    listOfFiles.forEach(file => {
      const Filename = `${Date.now()}-${file.originalname}`;
      const pathTo = path.join(projectBasePath, PathWhereSave, typology, Filename);
      fs.writeFile(pathTo, file.buffer, (err) => {
        if (err) {
          resolve({ success: false, error: err })
          return
        } else {
          countSuccess = countSuccess - 1
          listOfPath.push(`${routeTo}/${typology}/${Filename}`)
          if (countSuccess <= 0) {
            resolve({ success: true, data: listOfPath })
            return
          }
        }
      })
    })
  })
}

module.exports = {
  loadFileTo,
  getFile,
  saveArrayOfFiles
};
