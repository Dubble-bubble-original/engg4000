const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();
const ENV = process.env;

const bucketName = ENV.AWS_BUCKET_NAME;
const bucketRegion = ENV.AWS_REGION;
const accessKey = ENV.AWS_ACCESS_KEY_ID;
const secretAccessKey = ENV.AWS_SECRET_ACCESS_KEY;

console.log(bucketName);
console.log(bucketRegion);
console.log(accessKey);
console.log(secretAccessKey);

const s3 = new S3({
  bucketRegion,
  accessKey,
  secretAccessKey
});

console.log(s3);

// Upload a file to S3
exports.uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  };

  return s3.upload(uploadParams).promise();
};

// Download a file from S3
exports.getFile = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
};

// Delete a file from S3
