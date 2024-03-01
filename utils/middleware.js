const jwt = require('jsonwebtoken');
const { Blog } = require('../models/index');
const logger = require('./logger');
const { SECRET } = require('../utils/config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === 'TypeError') {
    return res.status(404).json({ error: error.message });
  } else if (error.name === 'SequelizeValidationError') {
    return res
      .status(404)
      .json({ error: 'Validation isEmail on username failed' });
  } else if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  blogFinder,
  errorHandler,
  tokenExtractor,
};
