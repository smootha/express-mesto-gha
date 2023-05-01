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
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(controlResponse(card)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (card.owner == req.user._id) {
        Card.findByIdAndRemove({ _id: id })
          .then((deleted) => res.send(controlResponse(deleted)))
          .catch((err) => next(err));
      } else {
        throw new ForbiddenError('Отказано в доступе: данная карточка вам неподвластна!');
      }
    })
    .catch(next);
};

// Добавить лайк карточки
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена!'))
    .then((card) => {
      res.send(controlResponse(card));
    })
    .catch(next);
};

// Убрать лайк карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена!'))
    .then((card) => {
      res.send(controlResponse(card));
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
