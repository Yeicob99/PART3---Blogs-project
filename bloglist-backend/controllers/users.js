const bcrypt = require('bcrypt');
const User = require('../models/user'); // Ensure correct import
const express = require('express'); // Asegúrate de importar express
const usersRouter = express.Router(); // Initialize usersRouter

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 });
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

module.exports = usersRouter; // Export the usersRouter
