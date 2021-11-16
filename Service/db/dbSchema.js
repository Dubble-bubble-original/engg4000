const mongoose = require('mongoose');
const { Schema } = mongoose;

const userPostSchema = new Schema({
  authorID: { type: mongoose.ObjectId, required: true, immutable: true },
  body: { type: String, required: true },
  tags: [{ type: String, required: true }],
  title: { type: String, required: true },
  imgURL: { type: String },
  date_created: { type: Date, default: Date.now, immutable: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  true_location: { type: Boolean, required: true },
  access_key: { type: String, required: true }
});
const UserPost = mongoose.model('UserPost', userPostSchema, 'UserPost');

const userSchema = new Schema({
  name: { type: String },
  avatar_url: { type: String },
  email: { type: String }
});
const User = mongoose.model('User', userSchema, 'User');

module.exports = { UserPost, User };

//  Check the Documentation folder for best practices on developing with schemas
