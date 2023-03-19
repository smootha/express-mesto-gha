const Card = require('../models/card');

// Получение всех карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' }));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const keyValues = ['name', 'link'];
  if (!(Object.keys(req.body).includes(keyValues))) {
    res.status(422).send({ message: 'В форме пропущены данные!' });
  } else {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user })
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные!' });
          return;
        }
        res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
      });
  }
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};

// Добавить лайк карточки
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};

// Убрать лайк карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(500).send({ message: 'Ошибочка вышла! Неизвестная!' });
    });
};
