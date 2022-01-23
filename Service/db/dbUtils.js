const mongoose = require('mongoose');
require('dotenv').config();
const ENV = process.env;

module.exports.connectTest = async (name) => {
  const testConnectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${name}?retryWrites=true&w=majority`;
  await mongoose.connect(testConnectionString);
};

module.exports.connectDatabase = async () => {
  console.log("carter-log");
  console.log(`mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority`);
  const connectionString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.pa1un.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority`;
  await mongoose.connect(connectionString);
};

module.exports.deleteDatabase = async () => {
  if (mongoose.connection.name === ENV.DB_NAME) {
    throw new Error('Cannot delete \'Production\' or \'Dev\' Database');
  }
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports.closeDatabase = async () => {
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
