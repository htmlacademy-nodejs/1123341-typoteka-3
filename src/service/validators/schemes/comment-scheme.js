'use strict';

const Joi = require(`joi`);
const {commentateMessage} = require(`../../../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .max(255)
    .required()
    .messages({
      'any.required': commentateMessage.REQUIRED_FIELD,
      'string.min': commentateMessage.MIN_LENGTH_FAILED
    })
});
