const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const API = require('../api/api');

ROUTER.post(
  '/auth',
  API.createAuthToken
);

ROUTER.get(
  '/version',
  API.verifyAuthToken,
  API.version
);

module.exports = ROUTER;
