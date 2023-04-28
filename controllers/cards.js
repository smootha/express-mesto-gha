const Card = require('../models/card');
const { NotFoundError } = require('../middlewares/NotFoundError');
const { BadRequestError } = require('../middlewares/BadRequestError');
const { ForbiddenError } = require('../middlewares/ForbiddenError');

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
const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

// Создание карточки
const createCard = (req, res, next) => {
  const keyValues = ['name', 'link'];
  if (!(keyValues.every((key) => Object.keys(req.body).includes(key)))) {
    throw new BadRequestError('В форме пропущены данные!');
  } else {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user })
      .then((card) => res.send(controlResponse(card)))
      .catch((err) => next(err));
  }
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user })
    .orFail(() => new ForbiddenError('Отказано в доступе: вы не создатель этой карточки!'))
    .then((card) => {
      res.send(controlResponse(card));
    })
    .catch((err) => next(err));
};

// Добавить лайк карточки
const likeCard = (req, res, next) => {
  if (req.user._id && (typeof req.user._id === 'string')) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .orFail(() => new NotFoundError('Карточка не найдена!'))
      .then((card) => {
        res.send(controlResponse(card));
      })
      .catch((err) => next(err));
  } else {
    throw new BadRequestError('Переданы некорректные данные!');
  }
};

// Убрать лайк карточки
const dislikeCard = (req, res, next) => {
  if (req.user._id && (typeof req.user._id === 'string')) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .orFail(() => new NotFoundError('Карточка не найдена!'))
      .then((card) => {
        res.send(controlResponse(card));
      })
      .catch((err) => next(err));
  } else {
    throw new BadRequestError('Переданы некорректные данные!');
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
