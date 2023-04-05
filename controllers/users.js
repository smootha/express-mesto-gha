// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const {
  AUTH_ERROR,
  INTERNAL_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT_ERROR,
} = require('../utils/utils');

// Функция для контроля над данными, приходящими с сервера
function controlResponse(user) {
  return {
    about: user.about,
    avatar: user.avatar,
    name: user.name,
    _id: user._id,
    email: user.email,
    password: user.password,
  };
}

// Логин
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch((err) => {
      res.status(AUTH_ERROR).send({ message: err.message });
    });
};

// Получение профиля пользователя
const getUser = (req, res) => {
  User.findById(req.user)
    .then((user) => res.send(user))
    .catch(() => res.status(NOT_FOUND).send({ message: 'Пользователь не найден' }));
};

// Получение всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' }));
};

// Получение пользователя по ID
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
      } else {
        res.send(controlResponse(user));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
        return;
      }
      res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};

// Создание пользователя
const createUser = (req, res) => {
  // Проверка на наличие всех данных для создания пользователя
  const keyValues = ['email', 'password'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    res.status(BAD_REQUEST).send({ message: 'В форме пропущены данные!' });
  } else {
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
      .then((user) => res.send(controlResponse(user)))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.code === 11000) {
          res.status(CONFLICT_ERROR).send({ message: 'Такой Email уже зарегистрирован!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Обновление профиля пользователя
const updateProfile = (req, res) => {
  // Проверка на наличие всех данных для обновления данных пользователя
  const keyValues = ['name', 'about'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    res.status(BAD_REQUEST).send({ message: 'В форме пропущены данные!' });
  } else {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
        } else {
          res.send(controlResponse(user));
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Обновление аватара пользователя
const updateAvatar = (req, res) => {
  // Проверка на наличие всех данных для обновления аватара пользователя
  const keyValue = 'avatar';
  if (!(Object.keys(req.body).includes(keyValue))) {
    res.status(BAD_REQUEST).send({ message: 'В форме пропущены данные!' });
  } else {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
        } else {
          res.send(controlResponse(user));
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({ message: 'Пользователь не найден!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
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
