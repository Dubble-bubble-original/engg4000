/* eslint-disable import/extensions */
/* eslint-disable max-len */
// Packages
const uuidv4 = require('uuid').v4;
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const download = require('image-downloader');

// Utils
const UTILS = require('../utils/utils');

// DB
const { UserPost, User } = require('../db/dbSchema');

// AWS
const {
  checkFile, downloadFile, deleteFile, sendEmail
} = require('../aws/aws');

// Constants
const POST_LIMIT_DEFAULT = 15;
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
  const uniqueObjectId = new ObjectId();
  const newUserPost = new UserPost({
    uid: uniqueObjectId,
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
        uid: newUserPost.uid,
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
    .select('-_id -access_key')
    .populate({
      path: 'author',
      select: '-_id'
    })
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
    .populate({
      path: 'author'
    })
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
    providedTags = UTILS.toLowerCaseTags(req.body.tags);

    searchFilters = [
      { $match: { tags: { $in: providedTags } } }
    ];
  }

  // Check if filters have Title
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
          uid: 1,
          title: 1,
          body: 1,
          tags: 1,
          author: 1,
          img_url: 1,
          date_created: 1,
          location: 1,
          location_string: 1,
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

  // Get current page number
  const pageNumber = req.body.page ? (req.body.page - 1) : 0;

  // Get # of posts per page
  const postLimit = req.body.post_limit ?? POST_LIMIT_DEFAULT;

  // Finalize the pipeline
  searchFilters = [
    ...searchFilters,
    {
      // Populate the author data
      $lookup: {
        from: User.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    // Unwind author from an array into a single object
    { $unwind: '$author' },
    {
      // Hide all id fields
      $project: {
        _id: false,
        access_key: false,
        'author._id': false
      }
    },
    {
      $facet: {
        // Skip & limit posts returned
        posts: [
          { $skip: pageNumber * postLimit },
          { $limit: postLimit }
        ],
        // Give back total number of posts matched (before skip/limit)
        info: [
          { $count: 'totalCount' }
        ]
      }
    }
  ];

  UserPost.aggregate(searchFilters)
    .then((result) => res.status(200).send({
      posts: result[0].posts,
      totalCount: result[0].info[0]?.totalCount ?? 0
    }))
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.getRecentPosts = (req, res) => {
  // Get # of posts per page
  const postLimit = req.body.post_limit ?? POST_LIMIT_DEFAULT;
  let postFilters = [{ $limit: postLimit }];

  // Filter by date (if given)
  if (req.body.date) {
    postFilters = [
      { $match: { date_created: { $lt: new Date(req.body.date) } } },
      ...postFilters
    ];
  }

  const pipeline = [
    {
      // Populate the author data
      $lookup: {
        from: User.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    // Unwind author from an array into a single object
    { $unwind: '$author' },
    {
      // Hide all id fields except uid
      $project: {
        _id: false,
        access_key: false,
        'author._id': false
      }
    },
    // Sort by most recent
    { $sort: { date_created: -1, _id: 1 } },
    {
      $facet: {
        // Filter posts returned
        posts: postFilters,
        // Give back total number of posts matched (before limit)
        info: [
          { $count: 'totalCount' }
        ]
      }
    }
  ];

  UserPost.aggregate(pipeline)
    .then((result) => res.status(200).send({
      posts: result[0].posts,
      totalCount: result[0].info[0]?.totalCount ?? 0
    }))
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
    avatar_url: req.body.avatar_url
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
        avatar_url: newUser.avatar_url
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
    .select('-_id')
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

  UTILS.createS3Image(file)
    .then((result) => {
      if (result === UTILS.Result.Error) {
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

exports.deleteFullUserPost = async (req, res) => {
  const userPostID = req.params.id;
  const status = {};
  let fullyDeleted = true;

  if (!ObjectId.isValid(userPostID)) {
    logger.info('Invalid Post ID Provided');
    return res.status(400).send({ message: 'Invalid Post ID Provided' });
  }

  // Deleting User Post
  const post = await UTILS.deleteDBPost(userPostID);
  if (post === UTILS.Result.NotFound) {
    return res.status(404).send({ message: 'User Post Not Found' });
  }
  if (post === UTILS.Result.Error) {
    return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }

  // Check to see if a user exists
  if (!post.author) {
    fullyDeleted = false;
    status.user = 'No User Provided';
  }
  else {
    // Delete user
    const user = await UTILS.deleteDBUser(post.author._id);
    if (user === UTILS.Result.NotFound) {
      fullyDeleted = false;
      status.user = 'User Not Found';
    }

    // Delete avatar image if provided
    if (post.author.avatar_url) {
      // Get avatar image id
      const avatarID = UTILS.getImageID(post.author.avatar_url);
      if (avatarID !== 'default_avatarImage.png') {
        // Checking if Avatar Image Exists
        const avatarExists = await checkFile(avatarID);

        // Delete avatar image if it exists
        let avatarImg = {};
        if (avatarExists) {
          avatarImg = UTILS.deleteS3Image(avatarID);
        }
        if (avatarImg === UTILS.Result.Error || !avatarExists) {
          status.avatar = 'Avatar Image Not Found';
          fullyDeleted = false;
        }
      }
    }
  }

  // Delete post image if provided
  if (post.img_url) {
    // Get post image id
    const postImageID = UTILS.getImageID(post.img_url);
    if (postImageID !== 'default_postImage.jpeg') {
      // Checking if Post Image Exists
      const postImageExists = await checkFile(postImageID);

      // Deleting post image if it exists
      let postImg = {};
      if (postImageExists) {
        postImg = UTILS.deleteS3Image(postImageID);
      }
      if (postImg === UTILS.Result.Error || !postImageExists) {
        status.postImg = 'Post Image Not Found';
        fullyDeleted = false;
      }
    }
  }

  // If the post is fully deleted update status
  if (fullyDeleted) {
    status.message = 'Post Deleted Successfully';
  }
  // Return the deleted post with the author
  return res.status(200).send({ status, post });
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
    const avatarResult = await UTILS.createS3Image(avatar);
    if (avatarResult === UTILS.Result.Error) {
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    }
    response.avatarId = avatarResult.key;
  }

  // Uploading post picture
  if (req.files.picture) {
    const picture = req.files.picture[0];
    const pictureResult = await UTILS.createS3Image(picture);
    if (pictureResult === UTILS.Result.Error) {
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

exports.createFullUserPost = async (req, res) => {
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
    name: user.name
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
    const uniqueObjectId = new ObjectId();
    const newUserPost = new UserPost({
      uid: uniqueObjectId,
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
          uid: newUserPost.uid,
          author: {
            name: newUser.name,
            avatar_url: newUser.avatar_url,
            email: newUser.email
          },
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

exports.sendAKEmail = async (req, res) => {
  if (!req.body.access_key || !req.body.to_email
      || !req.body.author_name || !req.body.post_title) {
    return res.status(400).send({ message: INVALID_REQUEST_ERROR_MSG });
  }

  const email = {
    from: 'notasocial.noreply@gmail.com',
    to: req.body.to_email,
    subject: 'Nota Post Access Code',
    html: `<p>Hi ${req.body.author_name}!`
        + `<p>Your Nota post '${req.body.post_title}' has been successfully posted!`
        + `<p>The access code to your new Nota post is <strong>${req.body.access_key}</strong>`
        + '<p><div style="color:red;">WARNING:</div>'
        + 'If this access code is lost, you will no longer be able to delete the post.</p>'
        + '<p>To keep your post secure, do NOT share your access code</p>'
        + '<p>Happy adventuring!</p>'
  };

  sendEmail(email)
    .then(() => res.status(200).send({ message: 'Email Sent Successfully' }))
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
    });
};

exports.verifyImages = async (req, res) => {
  const accessKey = req.params.ak;

  const post = await UTILS.getPost(accessKey);

  // If post is not found return
  if (post === UTILS.Result.NotFound) {
    return res.status(404).send({ message: 'User Post Not Found' });
  }
  if (post === UTILS.Result.Error) {
    return res.status(500).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }

  // Check Avatar Image
  if (post.author.avatar_url) {
    // Download Avatar Image
    const avatarImage = await download.image({
      url: post.author.avatar_url,
      dest: './model'
    });

    // Convert Image
    const avatarImageData = await UTILS.convert(avatarImage.filename);

    // Remove the image from Tesor and Model memory
    avatarImageData.dispose();

    // Call model to check image
    const avatarImageResults = await model.classify(avatarImageData);

    if (UTILS.checkImage(avatarImageResults)) {
      // Delete Image
      const results = UTILS.deleteS3Image(UTILS.getImageID(post.author.avatar_url));
      if (results === UTILS.Result.Error) {
        logger.error(INTERNAL_SERVER_ERROR_MSG);
      }

      // Update avatar image
      const query = { _id: post.author._id };
      const body = {
        upadte: {
          avatar_url: `${BUCKET_URL}default_avatarImage.png`
        }
      };
      await UTILS.updateAvatarImage(query, body);
    }
  }

  // Check Post Image
  if (post.img_url) {
    // Download post image
    const postImage = await download.image({
      url: post.img_url,
      dest: './model'
    });

    // Convert Image
    const postImageData = await UTILS.convert(postImage.filename);

    // Call model to check image
    const postImageResults = await model.classify(postImageData);

    // Remove the images from Tesor and Model memory
    postImageData.dispose();

    // Delete post image if needed
    if (UTILS.checkImage(postImageResults)) {
      // Delete Image
      const results = UTILS.deleteS3Image(UTILS.getImageID(post.img_url));
      if (results === UTILS.Result.Error) {
        logger.error(INTERNAL_SERVER_ERROR_MSG);
      }

      // Update post image
      const query = { _id: post._id };
      const body = {
        upadte: {
          avatar_url: `${BUCKET_URL}default_postImage.jpeg`
        }
      };
      await UTILS.updatePostImage(query, body);
    }
  }

  // Delete dowloaded images from storage
  fs.promises.unlink(postImage.filename);
  fs.promises.unlink(avatarImage.filename);

  return res.status(200).send({ postImage_Resulst: postImageResults, avatarImage_Results: avatarImageResults });
};
