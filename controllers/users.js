const User = require("../models/user");
const {ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
  STATUS_OK} = require('../utils/status')

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Ошибка по умолчанию" })
    );
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
        return;
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные пользователя",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
