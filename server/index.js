const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const api = require('./api');
const auth = require('./auth/auth.route');
const config = require('./config');
const logger = require('./log');
const views  = require('./app')

try {
  require('../hooks');
} catch (error) {
  logger.log(logger.constant.levels.warn, 'No hooks.js found in root directory');
}

const app = express();

// CONFIGURAZIONE DELL'APP EXPRESS
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  limit: '50mb',
}));
app.use(cors({
  origin: config.server.domain
}));
app.set('views', './server/views')
app.set('view engine', 'pug')

// SETUP ROUTE PER SERVIRE TUTTI I FILE PUBBLICI
app.use(express.static(path.join(__dirname,'public')));

// ROUTE BASE PER LE API
app.use('/api', api);

// ROUTE BASE PER L'AUTENTICAZIONE
app.use('/auth', auth);

// SETUP DI UNA ROUTE PER IL TESTING, NON CI SARA' IN PRODUZIONE
if (config.env !== config.production) {
  app.use('/test', (req, res) => {
    res.status(200).json({
      hello: 'hello',
    });
  });
}

app.use('/', views)

app.use('*', (req, res) => {
  res.status(404).json({
    err: 'Nessun percorso con questo indirizzo'
  })
})

// MIDDLEWARE PER LA GESTIONE DEGLI ERRORI
app.use(errorHandler);

// ESPORTO L'APP
module.exports = app;
