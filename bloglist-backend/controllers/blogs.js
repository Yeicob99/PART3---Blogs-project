const express = require('express');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user'); // Import User 
const jwt = require('jsonwebtoken'); // Import jwt for token verification

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.replace('Bearer ', '')
}
  return null
}

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
  const { title, url, likes } = request.body;

  // Verifica el token usando request.token
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log('Extracted token:', request.token);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }


  const user = await User.findById(decodedToken.id); // Obtén el usuario autenticado
  if (!user) {
    return response.status(401).json({ error: 'User not found' });
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title,
    author: user._id, // Asocia el blog al usuario autenticado
    url,
    likes: likes || 0, // Default likes to 0 if not provided
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); // Agrega el blog al usuario
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error in POST /api/blogs:', error); // Log para depuración
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

blogsRouter.delete('/:id', async (request, response) => {
  console.log('Request ID:', request.params.id); // Log del ID recibido
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const blog = await Blog.findById(request.params.id);
    console.log('Blog found:', blog); // Log del blog encontrado

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    // Verifica si el usuario autenticado es el creador del blog
    if (blog.author.toString() !== decodedToken.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    console.log('Blog deleted successfully'); // Log de éxito
    response.status(204).end();
  } catch (error) {
    console.error('Error in DELETE /api/blogs/:id:', error); // Log del error
    response.status(500).json({ error: 'An error occurred while deleting the blog' });
  }
});

module.exports = blogsRouter; // Export blogsRouter
