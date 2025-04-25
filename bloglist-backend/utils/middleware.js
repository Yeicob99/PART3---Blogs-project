const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null; // Si no hay token, asigna null
  }
  next(); // Pasa el control al siguiente middleware
};

module.exports = {
  tokenExtractor,
};
