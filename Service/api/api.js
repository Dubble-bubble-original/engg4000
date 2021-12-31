// Packages
const uuidv4 = require('uuid').v4;
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost } = require('../db/dbSchema');

// S3
const {
  uploadFile, checkFile, downloadFile, getFileUrl, deleteFile
} = require('../s3/s3');

// Post Limit Constant
const POST_LIMIT = 15;

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
      logger.error(err.message);
      return res.status(500).send(err);
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
      logger.error(err.message);
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
      logger.error(err.message);
      return res.status(500).send(err);
    });
};

exports.getUserPosts = (req, res) => {
  // empty filter returns all docs from Userposts
  let searchFilters = [];
  let providedTags = [];

  if (req.body.filter) {
    if (req.body.filter.tags || req.body.filter.title) {
      // Check if the filters have tags
      if (req.body.filter.tags?.length > 0) {
        searchFilters = [
          { $match: { tags: { $in: req.body.filter.tags } } }
        ];
        providedTags = req.body.filter.tags;
      }

      // Check id filters have Title
      if (req.body.filter.title) {
        searchFilters = [
          ...searchFilters,
          { $match: { title: req.body.filter.title } }
        ];
      }
    }
  }

  // Create new search format for partial matching tags
  if (providedTags.length > 0) {
    searchFilters = [
      ...searchFilters,
      {
        $project: {
          title: 1,
          body: 1,
          tags: 1,
          img_URL: 1,
          date_created: 1,
          location: 1,
          maxTagMatch: {
            $size: {
              $setIntersection: ['$tags', providedTags]
            }
          }
        }
      },
      { $sort: { maxTagMatch: -1, date_created: -1, _id: 1 } }
    ];
  }

  // If the searchFilters are empty an invalid (or no) filter was provided
  if (searchFilters.length === 0) {
    return res.status(400).send('Invalid search filters provided');
  }

  // Get current page number
  const pageNumber = req.body.page ? (req.body.page - 1) : 0;

  UserPost.aggregate(searchFilters).skip(pageNumber * POST_LIMIT).limit(POST_LIMIT)
    .then((docs) => res.status(200).send(docs))
    .catch((error) => {
      logger.error(error.message);
      return res.status(500).send(error);
    });
};

exports.getRecentPosts = (req, res) => {
  let searchFilters = [
    { $sort: { date_created: -1, _id: 1 } }
  ];

  if (req.body.date) {
    searchFilters = [
      { $match: { date_created: { $lt: new Date(req.body.date) } } },
      ...searchFilters
    ];
  }

  UserPost.aggregate(searchFilters).limit(POST_LIMIT)
    .then((docs) => res.status(200).send(docs))
    .catch((error) => {
      logger.error(error.message);
      return res.status(500).send(error);
    });
};

exports.createImage = async (req, res) => {
  if (!req.file) {
    logger.info('No Image Provided');
    return res.status(400).send('No Image Provided');
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
      return res.status(500).send('Failed to Create Image');
    });
};

exports.getImage = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send('Image Does Not Exist');
  }

  try {
    const readStream = downloadFile(fileKey);
    readStream.pipe(res);
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).send('Failed to Fetch Image');
  }
};

exports.getImageUrl = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send('Image Does Not Exist');
  }

  const result = getFileUrl(fileKey);

  if (!result) {
    logger.error('Failed to Get Image URL');
    return res.status(500).send('Failed to Get Image URL');
  }

  const response = { url: result };
  return res.status(200).send(response);
};

exports.deleteImage = async (req, res) => {
  const fileKey = req.params.id;

  const fileExists = await checkFile(fileKey);

  if (!fileExists) {
    logger.error('Image Does Not Exist');
    return res.status(404).send('Image Does Not Exist');
  }

  deleteFile(fileKey)
    .then(() => res.status(200).send())
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send('Failed to Delete Image');
    });
};
