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

const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");


const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      const createdUser = user.toObject();
      delete createdUser.password;
      res.status(STATUS_CREATED).send({ data: createdUser });
    })
    .catch((err) => {
      // if (err.name === "ValidationError") {
      //   return res.status(ERROR_BAD_REQUEST).send({
      //     message: "Переданы некорректные данные при создании пользователя",
      //   });
      // }
      if (err.code === 11000) {
        // return res.status(409).send({
        //   message: "Пользователь с таким email уже существует",
        // });
        next(new ConflictError("Пользователь с таким email уже существует"));
      } else {
        next(err)
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'))
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      // if (!user) {
      //   res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: "Пользователь по указанному _id не найден" });
      //   return;
      // }
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === "CastError") {
    //     return res.status(ERROR_BAD_REQUEST).send({
    //       message: "Переданы некорректные данные пользователя",
    //     });
    //   }
    //   return res
    //     .status(ERROR_INTERNAL_SERVER)
    //     .send({ message: "Ошибка по умолчанию" });
    // });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
        // res
        //   .status(ERROR_NOT_FOUND)
        //   .send({ message: "Пользователь по указанному _id не найден" });
        // return;
      }
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === "CastError") {
    //     return res.status(ERROR_BAD_REQUEST).send({
    //       message: "Переданы некорректные данные пользователя",
    //     });
    //   }
    //   return res
    //     .status(ERROR_INTERNAL_SERVER)
    //     .send({ message: "Ошибка по умолчанию" });
    // });
};

const updateProfile = (req, res, next) => {
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
      // if (!user) {
      //   return res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: "Пользователь по указанному _id не найден" });
      // }
    }).catch(next);
    // .catch((err) => {
    //   if (err.name === "ValidationError") {
    //     return res.status(ERROR_BAD_REQUEST).send({
    //       message: "Переданы некорректные данные при обновлении профиля",
    //     });
    //   }
    //   return res
    //     .status(ERROR_INTERNAL_SERVER)
    //     .send({ message: "Ошибка по умолчанию" });
    // });
};

const updateAvatar = (req, res, next) => {
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
      // if (!user) {
      //   return res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: "Пользователь по указанному _id не найден" });
      // }
      res.send({ data: user });
    }).catch(next);
    // .catch((err) => {
    //   if (err.name === "ValidationError") {
    //     return res.status(ERROR_BAD_REQUEST).send({
    //       message: "Переданы некорректные данные при обновлении аватара",
    //     });
    //   }
    //   return res
    //     .status(ERROR_INTERNAL_SERVER)
    //     .send({ message: "Ошибка по умолчанию" });
    // });
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
