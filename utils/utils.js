// eslint-disable-next-line import/no-extraneous-dependencies
const { Joi } = require('celebrate');

// Константы кодов ошибок
const BAD_REQUEST = 400;
const AUTH_ERROR = 401;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_ERROR = 500;

// Константа объекта хедера с токеном
const tokenHeader = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

// RegEx для валидации аватара
const avatarRegex = /^(https?:)\/\/(w{3}\.)?[\w._~:/?#[\]@!$&'()*+,;=]+(\/(#)?)?/i;

module.exports = {
  BAD_REQUEST,
  AUTH_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_ERROR,
  avatarRegex,
  tokenHeader,
};
