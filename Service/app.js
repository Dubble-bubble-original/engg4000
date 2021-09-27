const EXPRESS = require('express');
const APP = EXPRESS();
const mongoose = require('mongoose');
const dbConfig = require('./config').db;

// Get environment
require('dotenv').config();
const ENV = process.env;

//DB Credentials
const username = dbConfig.username;
const password = dbConfig.password;
const dbName = dbConfig.name;
const connectionString = `mongodb+srv://${username}:${password}@cluster0.pa1un.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

//Form DB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Mongodb connection successful");
});

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
    //console.log(process.env);
    logger.info(`Service running on port ${PORT}`);
});
