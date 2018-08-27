const Router = require('express').Router();
const multer = require('multer')
const cookieParser = require('cookie-parser')
const config = require('../config')
const { verifyuserProm, signToken, decodeTokenInCookie, getFreshUser } = require('../auth')
const HProm = require('../lib/happyProm')
const logger = require('../log')
const { saveArrayOfFiles } = require('../massStorage')

const Points = require('../models/point')
const Path = require('../models/path')
const Languages = require('../models/languages')
const User = require('../models/user')

const Isauth = [decodeTokenInCookie('/login'), getFreshUser]

Router.use(multer().any())
Router.use(cookieParser())

Router.get('/login', (req, res, next) => {
  res.render('login', {
    error: false,
    message: '',
    title: 'Login'
  })
})
Router.post('/login', async (req, res, next) => {
  if (typeof(req.body.email) !== 'string' || req.body.email.trim() === '') res.render('login', { error: true, message: 'Inserire una email', title: 'Login' })
  if (typeof(req.body.password) !== 'string' || req.body.password.trim() === '') res.render('login', { error: true, message: 'Inserire una password', email: req.body.email, title: 'Login' })
  const userAuth = await HProm(verifyuserProm(req.body.email, req.body.password))
  if (userAuth.success) {
    const token = signToken(userAuth.data.id)
    res.setHeader('Set-Cookie', `${config.cookie.cookieName}=${token};Expires=${new Date(Date.now() + config.cookie.expiration)};HttpOnly`)
    res.redirect('/dashboard')
  } else {
    res.render('login', {
      error: true,
      message: userAuth.data,
      email: req.body.email,
      title: 'Login'
    })
  }
})

Router.get('/profile', Isauth, async (req, res, next) => {
  const { dataValues } = req.user
  if (dataValues) {
    res.render('profile', {
      user: dataValues,
      title: 'Profile',
      isLogged: true
    })
  }
})
Router.post('/profile', Isauth, async (req, res, next) => {
  if (req.body.password.trim() === '') delete req.body.password
  const userUpdate = HProm(User.update(req.body, { where: {
    id: req.user.id
  }}))
  if (userUpdate.success) {
    res.redirect('/profile')
  } else {
    res.render('profile', {
      user: {
        ...req.body
      },
      error: userUpdate.data,
      title: 'Profile',
      isLogged: true
    })
  }
})

Router.get('/dashboard', Isauth, async (req, res, next) => {
  const points = await HProm(Points.findAll({
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
  }))
  const path = await HProm(Path.findAll({
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
    }))
  if (points.success && path.success) {
    res.render('index', {
      title: 'Dashboard',
      points: points.data,
      paths: path.data,
      isLogged: true
    })
  } else {
    if (points.data instanceof Error) {
      next(points.data)
    } else {
      next(path.data)
    }
  }
})

Router.get('/point', Isauth, (req, res, next) => {
  const supportedLanguage = config.languages
  res.render('point', {
    title: 'Create Point',
    isLogged: true,
    languages: supportedLanguage,
  })
})
Router.post('/point', Isauth, async (req, res, next) => {
  if (typeof req.files === 'object') {
    if (req.files.filter(file => file.mimetype.split('/')[0] === 'audio').length <= 0 ||
        req.files.filter(file => file.mimetype.split('/')[0] === 'image').length <= 0) {
      const supportedLanguage = config.languages
      res.render('point', {
        title: 'Create Point',
        isLogged: true,
        languages: supportedLanguage,
        error: true,
        message: 'Impossibile salvare inserire almeno un audio e un immagine'
      })
    } else {
      const saveAudio = await saveArrayOfFiles('audio', req.files.filter(file => file.mimetype.split('/')[0] === 'audio'))
      const saveImage = await saveArrayOfFiles('images', req.files.filter(file => file.mimetype.split('/')[0] === 'image'))
      if (saveAudio.success && saveImage.success) {
        req.body.images = saveImage.data
        req.body.audio = saveAudio.data
        // audio deve essere salvato come oggetto
        /*
        * {
        *   en: /api/rest/audio/audioInInglese.mp3
        *   it: /api/rest/audio/audioInIt.mp3
        * }
        */
        // vado avanti e valido e salvo il resto dei dati
      }
    }
  }
})

Router.get('/path', Isauth, (req, res, next) => {
  const supportedLanguage = config.languages
  res.render('path', {
    title: 'Create Path',
    isLogged: true,
    languages: supportedLanguage,
  })
})
Router.post('/path', Isauth)

Router.get('/logout', Isauth, (req, res, next) => {
  res.setHeader('Set-Cookie', `${config.cookie.cookieName}=null;Expires=${new Date('1/1/1990')}`)
  res.redirect('login')
})

Router.get('/', (req, res) => {
  res.redirect('/dashboard')
})

Router.use((error, req, res, next) => {
  logger.log(error)
  res.render('500', {...error, title: '500'})
})

module.exports = Router
