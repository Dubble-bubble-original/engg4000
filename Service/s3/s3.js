const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();
const ENV = process.env;

// Environment variables
const bucketName = ENV.AWS_BUCKET_NAME;
const bucketRegion = ENV.AWS_REGION;
const accessKey = ENV.AWS_ACCESS_KEY_ID;
const secretAccessKey = ENV.AWS_SECRET_ACCESS_KEY;

// S3 parameters
const s3 = new S3({
  bucketRegion,
  accessKey,
  secretAccessKey
});

// Upload a file to S3
exports.uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  };

  return s3.upload(uploadParams).promise();
};

// Download a file from S3
exports.downloadFile = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
};

// Get a file URL from S3
exports.getFileUrl = (fileKey) => {
  const getParams = {
    Key: fileKey,
    Bucket: bucketName,
    Expires: 300 // Expires in 5 minutes
  };

  return s3.getSignedUrl('getObject', getParams);
};

// Delete a file from S3
exports.deleteFile = async (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.deleteObject(deleteParams).promise();
};
