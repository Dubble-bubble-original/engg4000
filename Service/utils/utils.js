// Packages
const fs = require('fs');
const imageDecoder = require('image-decode');
const tf = require('@tensorflow/tfjs-node');

// DB
const { UserPost, User } = require('../db/dbSchema');

// AWS
const { uploadFile, deleteFile } = require('../aws/aws');

// Return Responses
const Result = { Success: 1, NotFound: 2, Error: 3 };
Object.freeze(Result);

exports.removeStaleTokens = (token) => {
  // Clear the stale token
  if (auth_tokens.has(token)) {
    auth_tokens.delete(token);
  }

  // Never let auth token map grow larger than 50,000 entries
  if (auth_tokens.size >= 50000) {
    auth_tokens.clear();
  }
};

// Auth token is stale if it is >= 30 minutes old.
exports.isAuthTokenStale = (currentTime, timeStamp) => (
  Math.floor((currentTime - timeStamp) / 1000) / 60 >= 30
);

// Get array of lower case tags
exports.toLowerCaseTags = (tags) => tags.map((tag) => tag.toLowerCase());

// Get Image ID from Image URL
exports.getImageID = (imgURL) => imgURL.substring(imgURL.lastIndexOf('/') + 1);

// Create S3 Image
exports.createS3Image = async (file) => (
  // Upload file to S3 bucket
  uploadFile(file)
    .then((result) => {
      // Delete file from local server
      fs.promises.unlink(file.path);

      return result;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    })
);

// Delete S3 Image
exports.deleteS3Image = async (image) => (
  // Delete image
  deleteFile(image)
    .then(() => Result.Success)
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    })
);

// Delete User
exports.deleteDBUser = async (userID) => (
  User.findByIdAndDelete(userID)
    .then((doc) => {
      if (!doc) {
        logger.info('User Not Found');
        return Result.NotFound;
      }
      return doc;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    })
);

// Delete Post
exports.deleteDBPost = async (postID) => (
  UserPost.findByIdAndDelete(postID)
    .select('-_id -access_key')
    .populate({
      path: 'author'
    })
    .exec()
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return Result.NotFound;
      }
      return doc;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    })
);

// Get Post
exports.getPost = async (accessKey) => (
  UserPost.findOne({ access_key: accessKey })
    .populate({
      path: 'author'
    })
    .exec()
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return Result.NotFound;
      }
      return doc;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    })
);

// Convert the image to UInt8 Byte array
exports.convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const imgData = await fs.readFileSync(img);
  const image = await imageDecoder(imgData);

  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let c = 0; c < numChannels; ++c) values[i * numChannels + c] = image.data[i * 4 + c];
  }

  return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
};

exports.checkImage = async (predictions) => {
  const neutral = predictions[0];
  const prob = Number((neutral.probability * 100).toFixed(0));
  if (prob >= 85) {
    return true;
  }
  return false;
};

exports.updatePostImage = async (query, body) => {
  UserPost.findOneAndUpdate(query, body, { new: true })
    .select('-_id -access_key')
    .exec()
    .then((doc) => {
      if (!doc) {
        logger.info('Post Image Not Updated');
        return Result.NotFound;
      }
      logger.info('Post Image Updated');
      return Result.Success;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    });
};

exports.updateAvatarImage = async (query, body) => {
  User.findOneAndUpdate(query, body, { new: true })
    .then(() => {
      if (!doc) {
        logger.info('Avatar Image Not Updated');
        return Result.NotFound;
      }
      logger.info('Avatar Image Updated');
      return Result.Success;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    });
};

// Get Image ID from Image URL
exports.getImageID = (imgURL) => imgURL.substring(imgURL.lastIndexOf('/') + 1);

exports.Result = Result;
