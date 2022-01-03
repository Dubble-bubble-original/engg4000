// Packages
const fs = require('fs');

// DB
const { UserPost, User } = require('../db/dbSchema');

// S3
const {
  uploadFile // , checkFile, downloadFile, getFileUrl, deleteFile
} = require('../s3/s3');

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

exports.createImage = async (file) => (
  // Upload file to S3 bucket
  uploadFile(file)
    .then((result) => {
      // Delete file from local server
      fs.unlinkSync(file.path);

      return result;
    })
    .catch((err) => {
      logger.error(err.message);
      return null;
    })
);

exports.getUser = async (userID) => (
  User.findById(userID)
    .then((doc) => {
      if (!doc) {
        // If no user found return an empty array
        logger.info('User Not Found');
        return [];
      }
      return doc;
    })
    .catch((err) => {
      logger.error(err.message);
      return null;
    })
);

exports.getPost = async (acessKey) => (
  UserPost.findOne({ access_key: acessKey })
    .then((doc) => {
      if (!doc) {
        logger.info('User Post Not Found');
        return [];
      }
      return doc;
    })
    .catch((err) => {
      logger.error(err.message);
      return null;
    })
);
