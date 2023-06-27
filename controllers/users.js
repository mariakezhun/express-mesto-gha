/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
} = require("../utils/status");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Ошибка по умолчанию" })
    );
};

const createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      User.create({ name, about, avatar, email, password: hash });
    })
    .then(() => {
      res.status(STATUS_CREATED).send({ name, about, avatar, email });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: "Пользователь с таким email уже существует",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
        return;
      }
      res.send({ data: user });
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
      res.send({ data: user });
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
      res.send({ data: user });
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

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка по умолчанию" });
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getUserById,
};
