const Card = require('../models/card');
const { INTERNAL_ERROR, NOT_FOUND, BAD_REQUEST } = require('../utils/utils');

// Функция для контроля над данными, приходящими с сервера
function controlResponse(card) {
  return {
    createdAt: card.date,
    likes: card.likes,
    link: card.link,
    name: card.name,
    owner: card.owner,
    _id: card._id,
  };
}
// Получение всех карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' }));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const keyValues = ['name', 'link'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    res.status(BAD_REQUEST).send({ message: 'В форме пропущены данные!' });
  } else {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user })
      .then((card) => res.send(controlResponse(card)))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(controlResponse(card)))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена!' });
        return;
      }
      if (err.name === 'TypeError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};

// Добавить лайк карточки
module.exports.likeCard = (req, res) => {
  if (req.user._id && (typeof req.user._id === 'string')) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => res.send(controlResponse(card)))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'TypeError') {
          res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  } else {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
  }
};

// Убрать лайк карточки
module.exports.dislikeCard = (req, res) => {
  if (req.user._id && (typeof req.user._id === 'string')) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => res.send(controlResponse(card)))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        if (err.name === 'TypeError') {
          res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
          return;
        }
        res.status(INTERNAL_ERROR).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  } else {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
  }
};
