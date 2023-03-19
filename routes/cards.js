const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Получение карточек
router.get('/', getAllCards);
// Создание карточки
router.post('/', createCard);
// Удаление карточки
router.delete('/:cardId', deleteCard);
// Добавить лайк карточки
router.put('/:cardId/likes', likeCard);
// Убрать лайк карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
