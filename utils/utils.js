// eslint-disable-next-line import/no-extraneous-dependencies
const { Joi } = require('celebrate');

// Константы кодов ошибок
const BAD_REQUEST = 400;
const AUTH_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_ERROR = 500;

// Константа объекта хедера с токеном
const tokenHeader = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);
// Константа ID пользователя в роутах
const userId = Joi.object().keys({
  userId: Joi.string().hex().length(24).required(),
});
// Константа ID карточек в роутах
const cardId = Joi.object().keys({
  cardId: Joi.string().hex().length(24).required(),
});

// RegEx для валидации изображений
const pictureRegex = /^(https?:)\/\/(w{3}\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]{2,3}[\w\-._~:/?#[\]@!$&'()*+,;=]*#?$/i;

module.exports = {
  BAD_REQUEST,
  AUTH_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_ERROR,
  pictureRegex,
  tokenHeader,
  userId,
  cardId,
};
