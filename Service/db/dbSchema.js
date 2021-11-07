const mongoose = require('mongoose');
const { Schema } = mongoose;

const userUserPostSchema = new Schema({
  author: { type: mongoose.ObjectId, required: true },
  body: { type: String, required: true },
  tags: [{ type: String, required: true }],
  title: { type: String, required: true },
  imgURL: { type: String },
  date_created: { type: Date, default: Date.now },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  true_location: { type: Boolean, required: true },
  access_key: { type: String, required: true }
});
const UserPost = mongoose.model('UserPost', userUserPostSchema, 'UserPost');

const userSchema = new Schema({
  name: { type: String },
  avatar_url: { type: String },
  email: { type: String }
});
const User = mongoose.model('User', userSchema, 'User');

module.exports = { UserPost, User };

//  Check the Documentation folder for best practices on developing with schemas
