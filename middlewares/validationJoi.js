const { celebrate } = require("celebrate");
const Joi = require('joi');
const { regLink } = require("../utils/regLink");

const createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regLink),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regLink),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regLink),
  }),
});

const deleteCardByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
});

const likeCardValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  getUserByIdValidation,
  updateProfileValidation,
  updateAvatarValidation,
  createCardValidation,
  deleteCardByIdValidation,
  likeCardValidation,
};
