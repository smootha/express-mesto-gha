const { INTERNAL_ERROR } = require('../utils/utils');

const errorHandler = (err, req, res, next) => {
  const { statusCode = INTERNAL_ERROR, message } = err;
  console.log(err.message);
  res.status(statusCode).send({
    message: statusCode === INTERNAL_ERROR
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
};

module.exports = { errorHandler };
