// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const { AuthError } = require('./AuthError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация!');
  }
  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Необходима авторизация!');
  }

  req.user = payload;
  next();
};

module.exports = { auth };
