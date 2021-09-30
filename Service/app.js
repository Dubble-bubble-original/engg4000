const EXPRESS = require('express');
const APP = EXPRESS();
const mongoose = require('mongoose');

// Get environment
require('dotenv').config();
const ENV = process.env;

// DB Connection
const connectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  // eslint-disable-next-line no-use-before-define
  logger.info('Mongodb connection successful');
  // Move the logger setup before DB Connection. (After Nathaniel's PR is merged)
});

// Define all routes in routes.js
APP.use('/', require('./routes/routes'));

// Setup logger
const WINSTON = require('winston');
const logger = WINSTON.createLogger({
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

// Start listening
const PORT = ENV.PORT || 9000;
APP.listen(PORT, () => {
  // TODO: Replace this with logger statement
  // console.log(process.env);
  logger.info(`Service running on port ${PORT}`);
});
