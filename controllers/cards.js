/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
} = require('../utils/status');

const getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
