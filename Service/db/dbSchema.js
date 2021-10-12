const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  date_created: { type: Date, default: Date.now },
  body: { type: String },
  tags: [{ type: String }],
  title: { type: String },
  imgURL: { type: String }
});
const Post = mongoose.model('Post', postSchema, 'Post');

const messageSchema = new Schema({
  author: { type: mongoose.ObjectId },
  body: { type: String },
  tags: [{ type: String }],
  title: { type: String },
  imgURL: { type: String },
  date_created: { type: Date, default: Date.now },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  true_location: { type: Boolean },
  access_key: { type: String }
});
const Message = mongoose.model('Message', messageSchema, 'Message');

const userSchema = new Schema({
  name: { type: String },
  avatar_url: { type: String },
  email: { type: String }
});
const User = mongoose.model('User', userSchema, 'User');

module.exports = { Post, Message, User };

//  Check the Documentation folder for best practices on developing with schemas
