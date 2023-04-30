const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { pictureRegex, userId } = require('../utils/utils');

// Возврат авторизованного пользователя
router.get('/me', getUser);
// Возврат всех пользователей
router.get('/', getUsers);
// Возврат пользователя по _id
router.get('/:userId', celebrate({
  [Segments.PARAMS]: userId,
}), getUserById);
// Обновление профиля пользователя
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    about: Joi.string()
      .min(2)
      .max(30)
      .required(),
  }),
}), updateProfile);
// Обновить аватар
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .regex(pictureRegex)
      .message('Некорректная ссылка на изображение!')
      .uri()
      .required(),
  }),
}), updateAvatar);

module.exports = router;
