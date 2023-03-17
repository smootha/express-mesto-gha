const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

// Возврат всех пользователей
router.get('/', getUsers);
// Возврат пользователя по _id
router.get('/:userId', getUserById);
// Создание пользователя
router.post('/', createUser);

module.exports = router;
