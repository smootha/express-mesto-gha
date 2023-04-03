// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const { AUTH_ERROR } = require('../utils/utils');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(AUTH_ERROR)
      .send({ message: 'Необходима авторизация!' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return err
      .status(AUTH_ERROR)
      .send({ message: 'Необходима авторизация!' });
  }

  req.user = payload;
  next();
};
