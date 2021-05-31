'use strict';

const Joi = require(`joi`);
const {articleMessage} = require(`../../../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': articleMessage.REQUIRED_FIELD,
      'string.min': articleMessage.MIN_LENGTH_FAILED,
      'string.max': articleMessage.MAX_LENGTH_FAILED,
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': articleMessage.REQUIRED_FIELD,
      'string.min': articleMessage.MIN_LENGTH_FAILED,
      'string.max': articleMessage.MAX_LENGTH_FAILED,
    }),

  fullText: Joi.string()
    .max(1000)
    .empty(``)
    .messages({
      'string.max': articleMessage.MAX_LENGTH_FAILED,
    }),

  picture: Joi.string()
    .empty(``),

  categories: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),

  userId: Joi
    .number()
    .integer()
});
