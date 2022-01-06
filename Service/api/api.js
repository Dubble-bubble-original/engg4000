/* eslint-disable no-unreachable */
// Packages
const uuidv4 = require('uuid').v4;
const { ObjectId } = require('mongoose').Types;

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost, User } = require('../db/dbSchema');

// S3
const {
  checkFile, downloadFile, getFileUrl, deleteFile
} = require('../s3/s3');

// Constants
const POST_LIMIT = 15;
const INTERNAL_SERVER_ERROR_MSG = 'An Unknown Error Occurred';
const INVALID_REQUEST_ERROR_MSG = 'Invalid Request Body Format';

const BUCKET_URL = 'https://senior-design-img-bucket.s3.amazonaws.com/';

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
  const accessKey = uuidv4();
  const newUserPost = new UserPost({
    author: req.body.author_ID,
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
        return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
      }
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }

    return res.status(201).json({
      post: {
        _id: newUserPost._id,
        author: newUserPost.author,
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
    .populate('author')
    .exec()
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
    .populate('author')
    .exec()
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
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send('No Request Body Provided');
  }

  let searchFilters = [];
  let providedTags = [];

  // Check if the filters have tags
  if (req.body.tags?.length > 0) {
    searchFilters = [
      { $match: { tags: { $in: req.body.tags } } }
    ];
    providedTags = req.body.tags;
  }

  // Check id filters have Title
  if (req.body.title) {
    searchFilters = [
      ...searchFilters,
      { $match: { title: req.body.title } }
    ];
  }

  // Create new search format for partial matching tags
  if (providedTags.length > 1) {
    searchFilters = [
      ...searchFilters,
      {
        $project: {
          title: 1,
          body: 1,
          tags: 1,
          author: 1,
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
  else if (providedTags.length === 1) {
    // When only one tag is provided sort by date_created
    searchFilters = [
      ...searchFilters,
      { $sort: { date_created: -1, _id: 1 } }
    ];
  }

  // If the searchFilters are empty an invalid (or no) filter was provided
  if (searchFilters.length === 0) {
    logger.info('Invalid search filters provided');
    return res.status(400).send('Invalid search filters provided');
  }

  // Add Authors to the searach filters
  searchFilters = [
    ...searchFilters,
    {
      $lookup: {
        from: User.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' }
  ];

  // Get current page number
  const pageNumber = req.body.page ? (req.body.page - 1) : 0;

  UserPost.aggregate(searchFilters).skip(pageNumber * POST_LIMIT).limit(POST_LIMIT)
    .then((docs) => res.status(200).send(docs))
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getRecentPosts = (req, res) => {
  let searchFilters = [
    {
      $lookup: {
        from: User.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' },
    { $sort: { date_created: -1, _id: 1 } }
  ];

  if (req.body.date) {
    searchFilters = [
      { $match: { date_created: { $lt: new Date(req.body.date) } } },
      ...searchFilters
    ];
  }

  UserPost.aggregate(searchFilters).limit(POST_LIMIT)
    .then((combinedDocs) => res.status(200).send(combinedDocs))
    .catch((error) => {
      logger.error(error.message);
      return res.status(500).send(error);
    });
};

exports.createUser = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  const newUser = new User({
    name: req.body.name,
    avatar_url: req.body.avatar_url,
    email: req.body.email
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
        email: newUser.email
      }
    });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    logger.info('Invalid User ID');
    return res.status(400).send({ message: 'Invalid User ID' });
  }

  // Find the userpost with the matching access key
  User.findByIdAndRemove(userId)
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

  return UTILS.createImage(file)
    .then((result) => {
      if (!result) {
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
      }

      const response = { id: result.key };
      return res.status(201).send(response);
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

exports.deletePost = async (req, res) => {
  const acessKey = req.params.ak;

  // Delete the User Post
  return UTILS.deletePost(acessKey)
    .then((post) => {
      if (post === undefined) {
        return res.status(404).send({ message: 'No Post Found' });
      }
      if (!post) {
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
      }

      // After the post is deleted, use author_ID to find and delete the user

      // At the end
      return res.status(200).send(post);
    });
};

exports.createPost = async (req, res) => {
  if (!req.files || req.files.length < 2) {
    logger.info('Missing Images');
    return res.status(400).send({ message: 'Missing Images' });
  }

  const avatar = req.files[0];
  const picture = req.files[1];

  return UTILS.createImage(avatar)
    .then((avatarResult) => {
      if (!avatarResult) {
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
      }

      const avatarKey = avatarResult.key;

      return UTILS.createImage(picture)
        .then((pictureResult) => {
          if (!pictureResult) {
            // Delete avatar
            deleteFile(avatarId)
              .then(() => res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG }))
              .catch((err) => {
                logger.error(err.message);
                return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
              });
          }

          const pictureKey = avatarResult.key;

          const avatarurl = BUCKET_URL + avatarKey;
          const pictureUrl = BUCKET_URL + pictureKey;

          // Create user with avatar

          // Create post with picture and user id
        });
    });
};
