const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const API = require('../api/api');

// Routes for application endpoints
ROUTER.get('/version', API.version);

module.exports = ROUTER;
