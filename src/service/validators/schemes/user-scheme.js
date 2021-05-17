'use strict';

const Joi = require(`joi`);
const {
  RegisterMessage,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
} = require(`../../../constants`);

module.exports = Joi.object({
  userName: Joi
    .string()
    .pattern(/^[a-zA-Z]+$/)
    .min(1)
    .max(255)
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.pattern.base': RegisterMessage.USERNAME_INCORRECT_FILLING
    }),

  userSurname: Joi
    .string()
    .pattern(/^[a-zA-Z]+$/)
    .min(1)
    .max(255)
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.pattern.base': RegisterMessage.USESURNAME_INCORRECT_FILLING
    }),

  userAvatar: Joi.string()
    .empty(``),

  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': RegisterMessage.WRONG_EMAIL,
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),

  password: Joi.string()
    .required()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .messages({
      'string.min': RegisterMessage.MIN_PASSWORD_LENGTH,
      'string.max': RegisterMessage.MAX_PASSWORD_LENGTH,
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),

  repeat: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.only': RegisterMessage.PASSWORDS_NOT_EQUALS,
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),
});
