const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null; // Si no hay token, asigna null
  }
  next(); // Pasa el control al siguiente middleware
};

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    request.user = user; // Asigna el usuario autenticado a la solicitud
    next(); // Pasa el control al siguiente middleware
  } catch (error) {
    next(error); // Pasa el error al manejador de errores
  }
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
