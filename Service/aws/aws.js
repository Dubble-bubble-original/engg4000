const S3 = require('aws-sdk/clients/s3');
const nodemailer = require('nodemailer');
const aws = require('@aws-sdk/client-ses');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
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

// Check if file exists
exports.checkFile = async (fileKey) => {
  const checkParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  try {
    await s3.headObject(checkParams).promise();
    return true;
  }
  catch (err) {
    logger.error(err.message);
    return false;
  }
};

// Download a file from S3
exports.downloadFile = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
};

// Delete a file from S3
exports.deleteFile = async (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.deleteObject(deleteParams).promise();
};

exports.sendEmail = async (email) => {
  // create aws SES object
  const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: ENV.AWS_REGION,
    defaultProvider
  });

  // create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({
    SES: { ses, aws }
  });

  return transporter.sendMail(
    {
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html
    }
  );
};
