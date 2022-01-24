// Express
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

// Express Rate limit
const RATE_LIMIT = require('express-rate-limit');

// Get environment
require('dotenv').config();
const ENV = process.env;

// Multer setup (used to upload files to the server)
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5000000 }, // 5MB
  dest: './uploads'
});

const API = require('../api/api');

// Wrapper function to use global error handler
const USE = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

ROUTER.post(
  '/auth',
  USE(API.createAuthToken)
);

// Limiters
const createPostLimiter = RATE_LIMIT({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 create post requests per window
  message: 'Too Many Posts Created From This IP Address',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const getPostsLimiter = RATE_LIMIT({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 250, // Limit each IP to 250 get requests per window
  message: 'Too Many Get Requests From This IP Address',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// Development API
if (ENV.NODE_ENV === 'dev') {
  // User post endpoints
  ROUTER.post(
    '/post',
    USE(API.verifyAuthToken),
    USE(API.createFullUserPost)
  );

  ROUTER.delete(
    '/deletepost/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteFullUserPost)
  );

  ROUTER.post(
    '/userpost',
    USE(API.verifyAuthToken),
    USE(API.createUserPost)
  );

  ROUTER.patch(
    '/userpost/:id',
    USE(API.verifyAuthToken),
    USE(API.updateUserPost)
  );

  ROUTER.delete(
    '/userpost/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteUserPost)
  );

  ROUTER.get(
    '/userpost/:ak',
    USE(API.verifyAuthToken),
    USE(API.getUserPost)
  );

  ROUTER.post(
    '/userposts',
    USE(API.verifyAuthToken),
    USE(API.getUserPosts)
  );

  ROUTER.post(
    '/recentposts',
    API.verifyAuthToken,
    API.getRecentPosts
  );

  // User endpoints
  ROUTER.post(
    '/user',
    USE(API.verifyAuthToken),
    USE(API.createUser)
  );

  ROUTER.delete(
    '/user/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteUser)
  );

  ROUTER.get(
    '/user/:id',
    USE(API.verifyAuthToken),
    USE(API.getUser)
  );

  // Image endpoints
  ROUTER.post(
    '/postimages',
    USE(API.verifyAuthToken),
    USE(upload.fields([{ name: 'avatar' }, { name: 'picture' }])),
    USE(API.uploadPostImages)
  );

  ROUTER.post(
    '/image',
    USE(API.verifyAuthToken),
    USE(upload.single('image')),
    USE(API.uploadImage)
  );

  ROUTER.get(
    '/image/:id',
    USE(API.verifyAuthToken),
    USE(API.getImage)
  );

  ROUTER.get(
    '/imageurl/:id',
    USE(API.verifyAuthToken),
    USE(API.getImageUrl)
  );

  ROUTER.delete(
    '/image/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteImage)
  );
}
// Production API
else if (ENV.NODE_ENV === 'prod') {
  // User post endpoints
  ROUTER.post(
    '/post',
    createPostLimiter,
    USE(API.verifyAuthToken),
    USE(API.createFullUserPost)
  );

  ROUTER.delete(
    '/deletepost/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteFullUserPost)
  );

  ROUTER.get(
    '/userpost/:ak',
    getPostsLimiter,
    USE(API.verifyAuthToken),
    USE(API.getUserPost)
  );

  ROUTER.post(
    '/userposts',
    getPostsLimiter,
    USE(API.verifyAuthToken),
    USE(API.getUserPosts)
  );

  ROUTER.post(
    '/recentposts',
    getPostsLimiter,
    API.verifyAuthToken,
    API.getRecentPosts
  );

  // Image endpoints
  ROUTER.post(
    '/postimages',
    createPostLimiter,
    USE(API.verifyAuthToken),
    USE(upload.fields([{ name: 'avatar' }, { name: 'picture' }])),
    USE(API.uploadPostImages)
  );

  ROUTER.delete(
    '/image/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteImage)
  );
}

module.exports = ROUTER;
