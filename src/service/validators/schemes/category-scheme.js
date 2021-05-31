'use strict';

const Joi = require(`joi`);
const {categoryMessage} = require(`../../../constants`);

module.exports = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'any.required': categoryMessage.REQUIRED_FIELD,
      'string.min': categoryMessage.MIN_LENGTH_FAILED,
      'string.max': categoryMessage.MAX_LENGTH_FAILED,
    })
});
