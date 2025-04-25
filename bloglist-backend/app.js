const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs'); // Ensure correct import
const config = require('./utils/config');
const logger = require('./utils/logger');
const usersRouter = require('./controllers/users'); // Ensure correct import
const loginRouter = require('./controllers/login'); // Importa el controlador de login
const middleware = require('./utils/middleware'); // Importa el middleware

const app = express();

mongoose.set('strictQuery', false);
logger.info('Conectando a MongoDB...');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Conectado a MongoDB');
  })
  .catch((error) => {
    logger.error('Error conectando a MongoDB:', error.message);
    process.exit(1); // Exit if connection fails
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor); // Registra el middleware antes de las rutas
app.use('/api/blogs', blogsRouter); // Ensure route is set up correctly
app.use('/api/users', usersRouter); // Ensure route is set up correctly
app.use('/api/login', loginRouter); // Registra la ruta de login

module.exports = app; // Ensure this line is present
