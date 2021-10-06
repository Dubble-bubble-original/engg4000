const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    date_created: {type: Date, default: Date.now},
    body: {type: String},
    tags: [{type: String}],
    title: {type: String},
    imgURL: {type: String}
});
const Post = mongoose.model('Post', postSchema, "Post");

module.exports = {Post};

//Check the Documentation folder for best practices on developing with schemas