const mongoose = require('mongoose');
require('dotenv').config();
const ENV = process.env;
const devConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_DEV_NAME}?retryWrites=true&w=majority`;
const testConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_TEST_NAME}?retryWrites=true&w=majority`;
const prodConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_PROD_NAME}?retryWrites=true&w=majority`;

module.exports.connectTest = async () => {
  await mongoose.connect(testConnectionString);
};

module.exports.connectDev = async () => {
  await mongoose.connect(devConnectionString);
};

module.exports.connectProd = async () => {
  await mongoose.connect(prodConnectionString);
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.close();
};
