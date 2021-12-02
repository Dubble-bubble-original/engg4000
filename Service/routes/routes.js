const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5000000 }, // 5MB
  dest: './uploads'
});

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

// User post endpoints

ROUTER.post(
  '/userpost',
  API.verifyAuthToken,
  API.createUserPost
);

ROUTER.patch(
  '/userpost/:id',
  API.verifyAuthToken,
  API.updateUserPost
);

ROUTER.delete(
  '/userpost/:ak',
  API.verifyAuthToken,
  API.deleteUserPost
);

ROUTER.get(
  '/userpost/:id',
  API.verifyAuthToken,
  API.getUserPost
);

ROUTER.post(
  '/userposts',
  API.verifyAuthToken,
  API.getUserPosts
);

// Image endpoints

ROUTER.post(
  '/image',
  API.verifyAuthToken,
  upload.single('image'),
  API.createImage
);

ROUTER.get(
  '/image/:id',
  API.verifyAuthToken,
  API.getImage
);

ROUTER.get(
  '/imageurl/:id',
  API.verifyAuthToken,
  API.getImageUrl
);

ROUTER.delete(
  '/image/:id',
  API.verifyAuthToken,
  API.deleteImage
);

module.exports = ROUTER;
