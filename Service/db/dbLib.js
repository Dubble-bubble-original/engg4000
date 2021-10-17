const mongoose = require('mongoose');
require('dotenv').config();
const ENV = process.env;
const devConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_DEV_NAME}?retryWrites=true&w=majority`;
const prodConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_PROD_NAME}?retryWrites=true&w=majority`;

module.exports.connectTest = async (name) => {
  const testConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${name}?retryWrites=true&w=majority`;
  await mongoose.connect(testConnectionString);
};

module.exports.connectDev = async () => {
  await mongoose.connect(devConnectionString);
};

module.exports.connectProd = async () => {
  await mongoose.connect(prodConnectionString);
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports.generateDBName = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nameLength = 10;
  let randomName = '';

  for (let i = 0; i < nameLength; i += 1) {
    randomName += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomName;
};
