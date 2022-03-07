// Packages
const fs = require('fs');

const Filter = require('bad-words');
const filter = new Filter();

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

// Determine if string contains bad words
exports.isStringProfane = (string) => filter.isProfane(string);

// Clean string of bad words
exports.cleanString = (string) => filter.clean(string);

exports.Result = Result;
