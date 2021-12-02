const uuidv4 = require('uuid').v4;
const { ObjectId } = require('mongoose').Types;
const UTILS = require('../utils/utils');
const { UserPost } = require('../db/dbSchema');

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
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send('No Request Body Provided');
  }

  const accessKey = uuidv4();
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
    access_key: accessKey
  });

  newUserPost.save((err) => {
    if (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        return res.status(400).send(err.message);
      }
      logger.error(err);
      return res.status(500).send(err);
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

exports.deleteUserPost = (req, res) => {
  const acessKey = req.params.ak;
  // Find the userpost with the matching access key
  UserPost.findOneAndDelete({ access_key: acessKey })
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return res.status(404).send('User Post Not Found');
      }

      return res.status(200).send();
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.getUserPost = (req, res) => {
  const userPostId = req.params.id;

  if (!ObjectId.isValid(userPostId)) {
    logger.info('Invalid User Post ID');
    return res.status(400).send('Invalid User Post ID');
  }

  UserPost.findById(userPostId)
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return res.status(404).send('User Post Not Found');
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.getUserPosts = (req, res) => {
  // empty filter returns all docs from Userposts
  let searchFilters = {};

  if (req.body.filter) {
    if (!req.body.filter.tags && !req.body.filter.title) {
      searchFilters = null;
    }
    else {
      const { filter } = req.body;

      // Check if the filters have tags
      if (req.body.filter.tags) {
        // If the tags are not empty, add them to filter
        if (req.body.filter.tags.length > 0) {
          const tagFilter = {
            tags: { $all: req.body.filter.tags }
          };
          searchFilters = { ...tagFilter };
        }
        else {
          // If tags are empty, dont add then to the search filters
          searchFilters = {};
        }

        // Delete the tags from the provided filters
        delete filter.tags;
      }

      searchFilters = { ...searchFilters, ...filter };
    }
  }

  // If the searchFilters is null an invalid filter was provided
  if (searchFilters === null) {
    return res.status(400).send('Invalid search filters filters provided');
  }

  // Limit the returned results to 1,000 user posts
  UserPost.find(searchFilters).limit(1000)
    .then((docs) => res.status(200).send(docs))
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};

exports.updateUserPost = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send('No Request Body Provided');
  }

  const userPostId = req.params.id;

  if (!ObjectId.isValid(userPostId)) {
    logger.info('Invalid User Post ID');
    return res.status(400).send('Invalid User Post ID');
  }

  const query = { _id: userPostId };
  UserPost.findOneAndUpdate(query, req.body.update, { new: true })
    .then((doc) => {
      if (!doc) {
        return res.status(404).send('User Post Not Found');
      }
      return res.status(200).send(doc);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send(err);
    });
};
