const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()

mongoose.set('strictQuery', false)
logger.info('Conectando a MongoDB...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Conectado a MongoDB')
  })
  .catch((error) => {
    logger.error('Error conectando a MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
