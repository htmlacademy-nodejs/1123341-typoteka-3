'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .required(),

  announce: Joi.string()
    .min(1)
    .max(255)
    .required(),

  fullText: Joi.string()
    .empty(``)
    .required(),

  picture: Joi.string()
    .empty(``)
    .required(),

  categories: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),

  userId: Joi
    .number()
    .integer()
});
