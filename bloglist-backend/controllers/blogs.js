const express = require('express');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user'); // Import User model

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

  if (!title || !url || !author) {
    return response.status(400).json({ error: 'Title, URL, and author are required' });
  }

  const user = await User.findById(author);
  if (!user) {
    return response.status(400).json({ error: 'Invalid author ID' });
  }

  const blog = new Blog({
    title,
    author: user._id, // Associate blog with the user
    url,
    likes: likes || 0, // Default likes to 0 if not provided
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); // Add blog to user's blogs
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while saving the blog' });
  }
});

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('author', { username: 1, name: 1 });
    response.json(blogs.map(blog => blog.toJSON())); // Ensure _id is included
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while fetching blogs' });
  }
});

module.exports = blogsRouter; // Export blogsRouter
