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
const { tokenHeader } = require('../utils/utils');

// Возврат авторизованного пользователя
router.get('/me', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), getUser);
// Возврат всех пользователей
router.get('/', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), getUsers);
// Возврат пользователя по _id
router.get('/:userId', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), getUserById);
// Обновление профиля пользователя
router.patch('/me', celebrate({
  [Segments.HEADERS]: tokenHeader,
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
}), updateProfile);
// Обновить аватар
router.patch('/me/avatar', celebrate({
  [Segments.HEADERS]: tokenHeader,
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), updateAvatar);

module.exports = router;
