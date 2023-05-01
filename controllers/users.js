// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const { NotFoundError } = require('../middlewares/NotFoundError');
const { BadRequestError } = require('../middlewares/BadRequestError');
const { ConflictError } = require('../middlewares/ConflictError');

// Функция для контроля над данными, приходящими с сервера
function controlResponse(user) {
  return {
    about: user.about,
    avatar: user.avatar,
    name: user.name,
    _id: user._id,
    email: user.email,
  };
}

// Логин
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch(next);
};

// Получение профиля пользователя
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(controlResponse(user)))
    .catch(next);
};

// Получение всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Получение пользователя по ID
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      } else {
        res.send(controlResponse(user));
      }
    })
    .catch(next);
};

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 13)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send(controlResponse(user));
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой Email уже зарегистрирован!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

// Обновление профиля пользователя
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден!'))
    .then((user) => res.send(controlResponse(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновление аватара пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден!'))
    .then((user) => {
      res.send(controlResponse(user));
    })
    .catch((err) => {
      if (err.name === 'ValidarionError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  login,
  getUser,
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
