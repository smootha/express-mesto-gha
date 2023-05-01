const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardId, pictureRegex } = require('../utils/utils');

// Получение карточек
router.get('/', getAllCards);

// Создание карточки
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    link: Joi.string()
      .uri()
      .regex(pictureRegex)
      .message('Некорректная ссылка на изображение!')
      .required(),
  }),
}), createCard);

// Удаление карточки
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: cardId,
}), deleteCard);

// Добавить лайк карточки
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: cardId,
}), likeCard);

// Убрать лайк карточки
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: cardId,
}), dislikeCard);

module.exports = router;
