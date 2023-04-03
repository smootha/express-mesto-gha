const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// Возврат всех пользователей
router.get('/', getUsers);
// Возврат пользователя по _id
router.get('/:userId', getUserById);
// Обновление профиля пользователя
router.patch('/me', updateProfile);
// Обновить аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
