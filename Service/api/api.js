// Packages
const uuidv4 = require('uuid').v4;
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost, User } = require('../db/dbSchema');

// S3
const {
  uploadFile, checkFile, downloadFile, getFileUrl, deleteFile
} = require('../s3/s3');

const INTERNAL_SERVER_ERROR_MSG = 'An Unknown Error Occurred';
const INVALID_REQUEST_ERROR_MSG = 'Invalid Request Body Format';

exports.createAuthToken = (req, res) => {
  const uuid = uuidv4();
  const timestamp = Date.now();
  auth_tokens.set(uuid, timestamp);

  const response = { token: uuid, timestamp };
  return res.send(response);
};

exports.verifyAuthToken = (req, res, next) => {
  const token = req.header('token');
  const currentTime = Date.now();

  // No auth token provided
  if (!token) {
    logger.info('No Authentication Token Provided');
    return res.status(401).send({ message: 'No Authentication Token Provided' });
  }

  const timeStamp = auth_tokens.get(token);

  // Invalid auth token or stale
  if (!timeStamp || UTILS.isAuthTokenStale(currentTime, timeStamp)) {
    UTILS.removeStaleTokens(token);
    logger.info('Invalid Authentication Token Provided');
    return res.status(401).send({ message: 'Invalid Authentication Token Provided' });
  }
  return next();
};

exports.version = (req, res) => {
  const { VERSION } = process.env;
  return res.send(`Service v${VERSION}`);
};

exports.createUserPost = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  const dateCreated = Date.now();
  const newUserPost = new UserPost({
    author_ID: req.body.author_ID,
    body: req.body.body,
    tags: req.body.tags,
    title: req.body.title,
    img_URL: req.body.img_URL,
    date_created: dateCreated,
    location: req.body.location,
    true_location: req.body.true_location,
    access_key: req.body.access_key
  });

  newUserPost.save((err) => {
    if (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
      }
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }

    return res.status(201).json({
      post: {
        _id: newUserPost._id,
        author_ID: newUserPost.author_ID,
        body: newUserPost.body,
        tags: newUserPost.tags,
        title: newUserPost.title,
        img_URL: newUserPost.img_URL,
        date_created: newUserPost.date_created,
        location: newUserPost.location,
        true_location: newUserPost.true_location,
        access_key: newUserPost.access_key
      }
    });
  });
};

exports.updateUserPost = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  const userPostId = req.params.id;

  if (!ObjectId.isValid(userPostId)) {
    logger.info('Invalid User Post ID');
    return res.status(400).send({ message: 'Invalid User Post ID' });
  }

  const query = { _id: userPostId };
  UserPost.findOneAndUpdate(query, req.body.update, { new: true })
    .then((doc) => {
      if (!doc) {
        return res.status(404).send({ message: 'User Post Not Found' });
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.deleteUserPost = (req, res) => {
  const acessKey = req.params.ak;

  // Find the userpost with the matching access key
  UserPost.findOneAndDelete({ access_key: acessKey })
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return res.status(404).send({ message: 'User Post Not Found' });
      }

      return res.status(200).send({ message: 'User Post Deleted Successfully' });
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getUserPost = (req, res) => {
  const userPostId = req.params.id;

  if (!ObjectId.isValid(userPostId)) {
    logger.info('Invalid User Post ID');
    return res.status(400).send({ message: 'Invalid User Post ID' });
  }

  UserPost.findById(userPostId)
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return res.status(404).send({ message: 'User Post Not Found' });
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getUserPosts = (req, res) => {
  // empty filter returns all docs from Userposts
  let filter = {};
  if (req.body.filter) filter = req.body.filter;

  // Limit the returned results to 100 user posts
  UserPost.find(filter).limit(100)
    .then((docs) => res.status(200).send(docs))
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.createUser = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  const accessKey = uuidv4();
  const newUser = new User({
    name: req.body.name,
    avatar_url: req.body.avatar_url,
    email: req.body.email,
    access_key: accessKey
  });

  newUser.save((err) => {
    if (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
      }
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }

    return res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        avatar_url: newUser.avatar_url,
        email: newUser.email,
        access_key: newUser.access_key
      }
    });
  });
};

exports.deleteUser = (req, res) => {
  const acessKey = req.params.ak;

  // Find the userpost with the matching access key
  User.findOneAndDelete({ access_key: acessKey })
    .then((doc) => {
      if (!doc) {
        logger.info('User Not Found');
        return res.status(404).send({ message: 'User Not Found' });
      }

      return res.status(200).send({ message: 'User Deleted Successfully' });
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getUser = (req, res) => {
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    logger.info('Invalid User ID');
    return res.status(400).send({ message: 'Invalid User ID' });
  }

  User.findById(userId)
    .then((doc) => {
      if (!doc) {
        logger.info('User Not Found');
        return res.status(404).send({ message: 'User Not Found' });
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.createImage = async (req, res) => {
  if (!req.file) {
    logger.info('No Image Provided');
    return res.status(400).send({ message: 'No Image Provided' });
  }

  const { file } = req;
  // Upload file to S3 bucket
  uploadFile(file)
    .then((result) => {
      // Delete file from local server
      fs.unlinkSync(file.path);

      const response = { id: result.key };
      return res.status(201).send(response);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getImage = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send({ message: 'Image Does Not Exist' });
  }

  try {
    const readStream = downloadFile(fileKey);
    readStream.pipe(res);
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

exports.getImageUrl = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send({ message: 'Image Does Not Exist' });
  }

  const result = getFileUrl(fileKey);

  if (!result) {
    logger.error('Failed to Get Image URL');
    return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }

  const response = { url: result };
  return res.status(200).send(response);
};

exports.deleteImage = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send({ message: 'Image Does Not Exist' });
  }

  deleteFile(fileKey)
    .then(() => res.status(200).send({ message: 'Image Deleted Successfully' }))
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};
