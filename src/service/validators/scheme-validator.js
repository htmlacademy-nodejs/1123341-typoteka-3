'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    console.log(`бобик`);
    console.log(body);

    try {
      await schema.validateAsync(body, {abortEarly: false});

    } catch (err) {
      console.log(`Каракурт`);
      const {details} = err;

      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: details.map((errorDescription) => errorDescription.message),
          data: body
        });

      return;
    }

    next();
  }
);
