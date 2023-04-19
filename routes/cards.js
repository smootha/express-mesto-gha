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
const { tokenHeader } = require('../utils/utils');

// Получение карточек
router.get('/', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), getAllCards);
// Создание карточки
router.post('/', celebrate({
  [Segments.HEADERS]: tokenHeader,
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);
// Удаление карточки
router.delete('/:cardId', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), deleteCard);
// Добавить лайк карточки
router.put('/:cardId/likes', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), likeCard);
// Убрать лайк карточки
router.delete('/:cardId/likes', celebrate({
  [Segments.HEADERS]: tokenHeader,
}), dislikeCard);

module.exports = router;
