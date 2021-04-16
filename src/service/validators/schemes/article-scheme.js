'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .required(),

  description: Joi.string()
    .min(1)
    .max(255)
    .required(),

  picture: Joi.string()
    .empty(``)
    .required(),

  sum: Joi.number()
    .required(),

  type: Joi.string()
    .valid(`OFFER`, `SALE`)
    .required(),

  categories: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});
