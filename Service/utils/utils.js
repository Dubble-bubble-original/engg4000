// Packages
const fs = require('fs');
const imageDecoder = require('image-decode');
const tf = require('@tensorflow/tfjs-node');

const Filter = require('bad-words');
const filter = new Filter();

// DB
const { UserPost, User } = require('../db/dbSchema');

// AWS
const { uploadFile, deleteFile } = require('../aws/aws');

// Return Responses
const Result = { Success: 1, NotFound: 2, Error: 3 };
Object.freeze(Result);
exports.Result = Result;

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

// Update Post
exports.setPostExplicitFlag = async (query) => {
  const body = {
    flagged: true
  };

  UserPost.findOneAndUpdate(query, body, { new: true })
    .select('-_id -access_key')
    .exec()
    .then((doc) => {
      if (!doc) {
        logger.info('Post not found (and flagged)');
        return Result.NotFound;
      }
      logger.info('Post flagged successfully');
      return Result.Success;
    })
    .catch((err) => {
      logger.error(err.message);
      return Result.Error;
    });
};

// Convert the image to UInt8 Byte array
exports.convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const imgData = await fs.readFileSync(img);
  const image = await imageDecoder(imgData);

  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let c = 0; c < numChannels; ++c) {
      values[i * numChannels + c] = image.data[i * 4 + c];
    }
  }

  return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
};

// Returns true if the image has to be deleted
exports.checkImage = (predictions) => {
  const results = {};
  predictions.forEach((prediction) => {
    const { className, probability } = prediction;
    results[className] = Number((probability * 100).toFixed(0));
  });

  // Return true if image needs to be deleted
  if (results.Neutral + results.Sexy < (results.Drawing + results.Porn + results.Hentai)) {
    return true;
  }
  return false;
};

// Geocoding format extraction
exports.extractGeocodeResult = (results) => {
  // Extract the country, province, city (if possible)
  let country; let province; let city;
  const foundAll = () => country && province && city;
  for (let i = results.length - 1; i >= 0 && !foundAll(); i--) {
    const components = results[i].address_components;
    for (let j = 0; j < components.length && !foundAll(); j++) {
      const component = components[j];
      if (!country && component.types.includes('country')) {
        country = component;
      }
      if (!province && component.types.includes('administrative_area_level_1')) {
        province = component;
      }
      if (!city && component.types.includes('locality')) {
        city = component;
      }
    }
  }

  // Build the response based on the received components
  let locationString = null;
  if (country) {
    locationString = country.long_name;
    if (province) {
      if (city) {
        // If city found, use short name for province
        locationString = `${city.long_name}, ${province.short_name}, ${locationString}`;
      }
      else {
        // Else use long name for province
        locationString = `${province.long_name}, ${locationString}`;
      }
    }
  }
  return locationString;
};

// Determine if string contains bad words
exports.isStringProfane = (string) => filter.isProfane(string);

// Clean string of bad words
exports.cleanString = (string) => {
  if (string) {
    return filter.clean(string);
  }

  return string;
};
