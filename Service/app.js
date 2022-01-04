const WINSTON = require('winston');
const mongoose = require('mongoose');
const cors = require('cors');
const EXPRESS = require('express');
const APP = EXPRESS();
const printServiceBanner = require('./banner/banner');

// Print service banner
printServiceBanner();

// Get environment
require('dotenv').config();
const ENV = process.env;

// API Middleware
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: true }));

// options for cross-origin resource sharing
const corsOptions = {
  origin: ENV.FRONTEND_URL
};

// Allow the app to use CORS with the defined routes in routes.js
APP.use(cors(corsOptions), require('./routes/routes'));

// Define all routes in routes.js
APP.use('/', require('./routes/routes'));

// Setup logger
global.logger = WINSTON.createLogger({
  level: 'info',
  format: WINSTON.format.json(),
  transports: [
    new WINSTON.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new WINSTON.transports.File({ filename: 'logs/combined.log' })
  ]
});
if (ENV.NODE_ENV === 'dev') {
  logger.add(new WINSTON.transports.Console({
    format: WINSTON.format.simple()
  }));
  logger.info('Service logger initialized');
}

// Global error handler
APP.use(function(err, req, res, next) {
  logger.error('An Unknown Error Occurred');
  logger.error(err.message);
  res.status(500).send({ message: 'An Unknown Error Occurred' });
  next();
});

// DB Connection
const db = require('./db/dbUtils');
db.connectDatabase();
const dbConnection = mongoose.connection;

dbConnection.on('error', function() {
  logger.error('Mongodb connection error');
});

dbConnection.once('open', function() {
  logger.info('Mongodb connection successful');
});

// Setup Authorization Token map
// format: uuid - timestamp
// e.g., '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' - 1519211809934
global.auth_tokens = new Map();

// Start listening
const PORT = ENV.PORT || 9000;
APP.listen(PORT, () => {
  logger.info(`Service running on port ${PORT}`);
});
