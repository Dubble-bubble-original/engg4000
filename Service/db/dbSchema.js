const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, immutable: true },
  avatar_url: { type: String, immutable: true },
  email: { type: String, required: true, immutable: true }
});
const User = mongoose.model('User', userSchema, 'User');

const userPostSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, required: true, immutable: true, ref: 'User'
  },
  body: { type: String, required: true },
  tags: [{ type: String, required: true }],
  title: { type: String, required: true },
  img_url: { type: String },
  date_created: { type: Date, default: Date.now, immutable: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  location_string: { type: String, required: true },
  true_location: { type: Boolean, required: true },
  access_key: { type: String, required: true, unique: true }
});
const UserPost = mongoose.model('UserPost', userPostSchema, 'UserPost');

module.exports = { UserPost, User };

//  Check the Documentation folder for best practices on developing with schemas
