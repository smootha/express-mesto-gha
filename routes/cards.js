const router = require('express').Router();
const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

// Получение карточек
router.get('/', getAllCards);
// Создание карточки
router.post('/', createCard);
// Удаление карточки
router.delete('/:id', deleteCard);

module.exports = router;
