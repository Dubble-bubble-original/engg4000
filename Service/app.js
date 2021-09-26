const EXPRESS = require('express');
const APP = EXPRESS();

// Get environment
require('dotenv').config();
const ENV = process.env;

// Define all routes in routes.js
APP.use('/', require('./routes/routes'))

// Setup logger
const WINSTON = require('winston');
const logger = WINSTON.createLogger({
    level: 'info',
    format: WINSTON.format.json(),
    transports: [
      new WINSTON.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new WINSTON.transports.File({ filename: 'logs/combined.log' }),
    ],
});
if (ENV.NODE_ENV === 'dev') {
    logger.add(new WINSTON.transports.Console({
      format: WINSTON.format.simple(),
    }));
    logger.info('Service logger initialized');
}

// Start listening
const PORT = ENV.PORT || 9000;
APP.listen(PORT, () => {
    // TODO: Replace this with logger statement
    logger.info(`Service running on port ${PORT}`);
});
