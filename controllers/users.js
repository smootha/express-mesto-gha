const User = require('../models/user');

// Функция для контроля над данными, приходящими с сервера
function controlResponse(user) {
  return {
    about: user.about,
    avatar: user.avatar,
    name: user.name,
    _id: user._id,
  };
}

// Получение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' }));
};

// Получение пользователя по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(controlResponse(user)))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  // Проверка на наличие всех данных для создания пользователя
  const keyValues = ['name', 'about', 'avatar'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    res.status(422).send({ message: 'В форме пропущены данные!' });
  } else {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
      .then((user) => res.send(controlResponse(user)))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Обновление профиля пользователя
module.exports.updateProfile = (req, res) => {
  // Проверка на наличие всех данных для обновления данных пользователя
  const keyValues = ['name', 'about'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    res.status(422).send({ message: 'В форме пропущены данные!' });
  } else {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.send(controlResponse(user)))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'CastError') {
          res.status(404).send({ message: 'Пользователь не найден!' });
          return;
        }
        res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  // Проверка на наличие всех данных для обновления аватара пользователя
  const keyValue = 'avatar';
  if (!(Object.keys(req.body).includes(keyValue))) {
    res.status(422).send({ message: 'В форме пропущены данные!' });
  } else {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.send(controlResponse(user)))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'CastError') {
          res.status(404).send({ message: 'Пользователь не найден!' });
          return;
        }
        res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};
