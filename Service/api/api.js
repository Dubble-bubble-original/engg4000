// Packages
const uuidv4 = require('uuid').v4;
const fs = require('fs');

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost } = require('../db/dbSchema');

// S3
const {
  uploadFile, downloadFile, getFileUrl, deleteFile
} = require('../s3/s3');

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
    return res.status(401).send('No Authentication Token Provided');
  }

  const timeStamp = auth_tokens.get(token);

  // Invalid auth token or stale
  if (!timeStamp || UTILS.isAuthTokenStale(currentTime, timeStamp)) {
    UTILS.removeStaleTokens(token);
    logger.info('Invalid Authentication Token Provided');
    return res.status(401).send('Invalid Authentication Token Provided');
  }
  return next();
};

exports.version = (req, res) => {
  const { VERSION } = process.env;
  return res.send(`Service v${VERSION}`);
};

exports.createUserPost = (req, res) => {
  const newUserPost = new UserPost({
    author: req.body.authorID,
    body: req.body.body,
    tags: req.body.tags,
    title: req.body.title,
    imgURL: req.body.imgURL,
    date_created: req.body.date_created,
    location: req.body.location,
    true_location: req.body.true_location,
    access_key: req.body.access_key
  });

  newUserPost.save((err) => {
    if (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err.message);
      }
      return res.status(500).send(err);
    }

    return res.status(201).json({
      post: {
        _id: newUserPost._id,
        author: newUserPost.authorID,
        body: newUserPost.body,
        tags: newUserPost.tags,
        title: newUserPost.title,
        imgURL: newUserPost.imgURL,
        date_created: newUserPost.date_created,
        location: newUserPost.location,
        true_location: newUserPost.true_location,
        access_key: newUserPost.access_key
      }
    });
  });
};

exports.deleteUserPost = (req, res) => {
  // Find the userpost with the matching ID
  UserPost.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).send('User Post not found.');
      }

      if (!('access_key' in req.body)) {
        return res.status(400).send('Client body does NOT contain an access-key.');
      }

      // Check if the req & userpost access_key's match for deletion
      if (doc.access_key === req.body.access_key) {
        UserPost.findByIdAndDelete(req.params.id)
          .catch((err) => {
            logger.error(err);
            return res.status(500).send(err);
          });
        return res.status(200).send();
      }
      return res.status(403).send('Client access-key does NOT match the user post.');
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.getUserPost = (req, res) => {
  UserPost.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).send('User Post not found.');
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.createImage = async (req, res) => {
  if (!req.file) {
    logger.info('No Image Provided');
    return res.status(400).send('No Image Provided');
  }

  const { file } = req;
  // Upload file to S3 bucket
  await uploadFile(file)
    .then((result) => {
      // Delete file from local server
      fs.unlinkSync(file.path);

      const response = { id: result.key };
      return res.status(200).send(response);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.getImage = (req, res) => {
  const fileKey = req.params.id;
  try {
    const readStream = downloadFile(fileKey);
    readStream.pipe(res);
  }
  catch (err) {
    logger.error(err);
    return res.status(500).send(err);
  }
};

exports.getImageUrl = (req, res) => {
  const fileKey = req.params.id;
  try {
    const result = getFileUrl(fileKey);
    const response = { url: result };
    return res.status(200).send(response);
  }
  catch (err) {
    logger.error(err);
    return res.status(500).send(err);
  }
};

exports.deleteImage = async (req, res) => {
  const fileKey = req.params.id;
  await deleteFile(fileKey)
    .then(() => res.status(200).send())
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};
