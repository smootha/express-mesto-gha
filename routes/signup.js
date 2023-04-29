const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, Segments } = require('celebrate');
const { createUser } = require('../controllers/users');
const { pictureRegex } = require('../utils/utils');

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
    avatar: Joi.string()
      .regex(pictureRegex)
      .message('Некорректная ссылка на изображение!'),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .required()
      .min(8),
  }),
}), createUser);

module.exports = router;
