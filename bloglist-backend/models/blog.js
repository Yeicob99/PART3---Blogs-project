const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure title is required
  },
  author: String,
  url: {
    type: String,
    required: true, // Ensure URL is required
  },
  likes: {
    type: Number,
    default: 0, // Default likes to 0
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    // Ensure _id is retained for testing purposes
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema); // Ensure correct model name