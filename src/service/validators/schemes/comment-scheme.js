'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .max(255)
    .required(),
});
