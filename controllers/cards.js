const Card = require('../models/card');
// Получение всех карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Попробуйте еще раз!' }));
};
// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Попробуйте еще раз!' }));
};
// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Попробуйте еще раз!' }));
};
// Добавить лайк карточки
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Попробуйте еще раз!' }));
};
// Убрать лайк карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибочка вышла! Попробуйте еще раз!' }));
};
