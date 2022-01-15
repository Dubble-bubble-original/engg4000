// Packages
const uuidv4 = require('uuid').v4;
const { ObjectId } = require('mongoose').Types;

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost, User } = require('../db/dbSchema');

// S3
const {
  checkFile, downloadFile, deleteFile
} = require('../s3/s3');

// Constants
const POST_LIMIT = 15;
const BUCKET_URL = 'https://senior-design-img-bucket.s3.amazonaws.com/';
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

exports.createUserPost = (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  const dateCreated = Date.now();
  const accessKey = uuidv4();
  const newUserPost = new UserPost({
    author: req.body.author,
    body: req.body.body,
    tags: req.body.tags,
    title: req.body.title,
    img_url: req.body.img_url,
    date_created: dateCreated,
    location: req.body.location,
    true_location: req.body.true_location,
    location_string: req.body.location_string,
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
        img_url: newUserPost.img_url,
        date_created: newUserPost.date_created,
        location: newUserPost.location,
        true_location: newUserPost.true_location,
        location_string: newUserPost.location_string,
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
  const userPostId = req.params.id;

  if (!ObjectId.isValid(userPostId)) {
    logger.info('Invalid User Post ID');
    return res.status(400).send({ message: 'Invalid User Post ID' });
  }

  UserPost.findByIdAndDelete(userPostId)
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
  const acessKey = req.params.ak;

  UserPost.findOne({ access_key: acessKey })
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
    return res.status(400).send({ message: 'No Request Body Provided' });
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
          img_url: 1,
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
    return res.status(400).send({ message: 'Invalid search filters provided' });
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
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
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

  // Find the user with the matching id
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

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    logger.info('No Image Provided');
    return res.status(400).send({ message: 'No Image Provided' });
  }

  const { file } = req;

  UTILS.createImage(file)
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

exports.uploadPostImages = async (req, res) => {
  // Request body must contain at least one image
  if (!req.files || req.files.length < 1) {
    logger.info('No Images Provided');
    return res.status(400).send({ message: 'No Images Provided' });
  }

  const response = {
    avatarId: null,
    pictureId: null
  };

  // Uploading avatar
  if (req.files.avatar) {
    const avatar = req.files.avatar[0];
    const avatarResult = await UTILS.createImage(avatar);
    if (!avatarResult) {
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }
    response.avatarId = avatarResult.key;
  }

  // Uploading post picture
  if (req.files.picture) {
    const picture = req.files.picture[0];
    const pictureResult = await UTILS.createImage(picture);
    if (!pictureResult) {
      // Delete avatar
      if (response.avatarId) {
        // Delete avatar
        deleteFile(avatarKey)
          .then(() => res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG }))
          .catch((deleteAvatarError) => {
            logger.error(deleteAvatarError.message);
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
          });
      }
    }
    response.pictureId = pictureResult.key;
  }

  return res.status(201).send(response);
};

exports.createPost = async (req, res) => {
  // No request body provided
  if (!req.body || !Object.keys(req.body).length) {
    logger.info('No Request Body Provided');
    return res.status(400).send({ message: 'No Request Body Provided' });
  }

  // Request body must contain user and user post data
  if (!req.body.user) {
    logger.info('Missing User');
    return res.status(400).send({ message: 'Missing User' });
  }
  if (!req.body.post) {
    logger.info('Missing User Post');
    return res.status(400).send({ message: 'Missing User Post' });
  }

  const {
    user, post, avatarId, pictureId
  } = req.body;

  // Create user with uploaded avatar
  const newUser = new User({
    name: user.name,
    email: user.email
  });
  if (avatarId) {
    newUser.avatar_url = BUCKET_URL + avatarId;
  }

  newUser.save((userError) => {
    if (userError) {
      logger.info(userError.message);

      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
      }
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }

    // Create post with new user id and uploaded post picture
    const dateCreated = Date.now();
    const accessKey = uuidv4();
    const newUserPost = new UserPost({
      author: newUser._id,
      body: post.body,
      tags: post.tags,
      title: post.title,
      date_created: dateCreated,
      location: post.location,
      true_location: post.true_location,
      location_string: post.location_string,
      access_key: accessKey
    });
    if (pictureId) {
      newUserPost.img_url = BUCKET_URL + pictureId;
    }

    newUserPost.save((postError) => {
      if (postError) {
        logger.info(postError.message);

        // Delete user
        User.findByIdAndRemove(newUser._id)
          .catch((deleteUserError) => {
            logger.error(deleteUserError.message);
          });

        if (postError.name === 'ValidationError') {
          return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
        }
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
      }

      return res.status(201).json({
        post: {
          _id: newUserPost._id,
          author: newUser,
          body: newUserPost.body,
          tags: newUserPost.tags,
          title: newUserPost.title,
          img_url: newUserPost.img_url,
          date_created: newUserPost.date_created,
          location: newUserPost.location,
          true_location: newUserPost.true_location,
          location_string: newUserPost.location_string,
          access_key: newUserPost.access_key
        }
      });
    });
  });
};
