const EXPRESS = require('express');
const APP = EXPRESS();
const mongoose = require('mongoose');

// Get environment
require('dotenv').config();
const ENV = process.env;

// Define all routes in routes.js
APP.use('/', require('./routes/routes'));

// Setup logger
const WINSTON = require('winston');
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

// DB Connection
const connectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', function() {
  logger.error('Mongodb connection error');
});
db.once('open', function() {
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
