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

ROUTER.post(
  '/userpost',
  API.verifyAuthToken,
  API.createUserPost
);

ROUTER.delete(
  '/userpost/:id',
  API.verifyAuthToken,
  API.deleteUserPost
);

ROUTER.get(
  '/userpost/:id',
  API.verifyAuthToken,
  API.getUserPost
);

ROUTER.get(
  '/userposts',
  API.verifyAuthToken,
  API.getUserPosts
);

ROUTER.put(
  '/userpost/:id',
  API.verifyAuthToken,
  API.updateUserPost
);
module.exports = ROUTER;
