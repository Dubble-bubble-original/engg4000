const WINSTON = require('winston');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const EXPRESS = require('express');
const session = require('express-session');
const APP = EXPRESS();
const nsfw = require('nsfwjs');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const printServiceBanner = require('./banner/banner');
const db = require('./db/dbUtils');

// Print service banner
printServiceBanner();

// Get environment
require('dotenv').config();
const ENV = process.env;

// Create a temp directory to store model images
if (!fs.existsSync('./model')) {
  fs.mkdirSync('./model', {
    recursive: true
  });
}

// API Middleware
APP.use(EXPRESS.json({ limit: '2mb' }));
APP.use(EXPRESS.urlencoded({ limit: '2mb', extended: true }));
APP.use(session({
  secret: ENV.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 5 * 60 * 1000 // 5 minutes
  },
  store: new MongoStore({
    mongoUrl: db.connectionString
  })
}));

// options for cross-origin resource sharing
const corsOptions = {
  credentials: true, // Needed to receive cookies properly from frontend
  origin: ENV.FRONTEND_URL
};

if (ENV.NODE_ENV !== 'dev') {
  // enable production mode
  tf.enableProdMode();
}
// nsfw model
const loadModel = async () => {
  global.model = await nsfw.load();
};

// Allow the app to use CORS with the defined routes in routes.js
APP.use(cors(corsOptions), require('./routes/routes'));

// Define all routes in routes.js
APP.use('/', require('./routes/routes'));

// Setup logger
global.logger = WINSTON.createLogger({
  level: 'info',
  format: WINSTON.format.combine(
    WINSTON.format.timestamp(),
    WINSTON.format.prettyPrint()
  ),
  transports: [
    new WINSTON.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new WINSTON.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (ENV.NODE_ENV === 'dev') {
  logger.add(new WINSTON.transports.Console({}));
}
logger.info('Service logger initialized');

// Global error handler
APP.use(function(err, req, res, next) {
  logger.error('An Unknown Error Occurred');
  logger.error(err.message);
  res.status(500).send({ message: 'An Unknown Error Occurred' });
  next();
});

// DB Connection
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
const PORT = ENV.PORT || 3001;
// Keep the model in memory, make sure it's loaded only once
loadModel().finally(() => {
  APP.listen(PORT, () => {
    logger.info(`Service running on port ${PORT}`);
  });
});
