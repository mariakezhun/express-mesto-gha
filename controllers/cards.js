/* eslint-disable consistent-return */
const Card = require("../models/card");
const {
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
} = require("../utils/status");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");


const getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("Карточка по указанному _id не найдена");
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: "Не ваше" });
      }
      return Card.deleteOne(card).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Переданы некорректные данные'))
        // return res.status(ERROR_BAD_REQUEST).send({
        //   message: "Переданы некорректные",
        // });
      } else {
        next(err)
      }
    })
};

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка по указанному _id не найдена");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Переданы некорректные данные'))
        // return res.status(ERROR_BAD_REQUEST).send({
        //   message: "Переданы некорректные",
        // });
      } else {
        next(err)
      }
    })
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка по указанному _id не найдена");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Переданы некорректные данные'))
        // return res.status(ERROR_BAD_REQUEST).send({
        //   message: "Переданы некорректные",
        // });
      } else {
        next(err)
      }
    })
};

module.exports = {
  getCard,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
