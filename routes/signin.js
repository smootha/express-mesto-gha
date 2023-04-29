const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, Segments } = require('celebrate');
const { login } = require('../controllers/users');

router.post('/', celebrate({
  [Segments.HEADERS]: Joi.object().unknown(true),
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(8),
  }),
}), login);

module.exports = router;
