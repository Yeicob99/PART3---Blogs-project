const express = require('express');
const mongoose = require('mongoose');
const Blog = require('../models/blog');

const blogsRouter = express.Router(); // Initialize blogsRouter

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid blog ID' });
  }

  if (likes === undefined || typeof likes !== 'number' || likes < 0) {
    return response.status(400).json({ error: 'Invalid likes value' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    );

    if (updatedBlog) {
      response.status(200).json(updatedBlog);
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while updating the blog' });
  }
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Default likes to 0 if not provided
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while saving the blog' });
  }
});

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON())); // Ensure _id is included
});

module.exports = blogsRouter; // Export blogsRouter
