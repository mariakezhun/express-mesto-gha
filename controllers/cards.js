/* eslint-disable consistent-return */
const Card = require("../models/card");
const {
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
} = require("../utils/status");

const NotFoundError = require("../errors/NotFoundError");

const getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Ошибка по умолчанию" })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("Карточка по указанному _id не найдена");
    })
    .then((card) => {
      // if (!card) {
      //   return res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: "Карточка по указанному _id не найдена" });
      // }
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: "Не ваше" });
      }
      return Card.deleteOne(card).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные",
        });
      } else {
        next(err)
      }
      // return res.send({ message: err.message });
    })
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
        return;
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
