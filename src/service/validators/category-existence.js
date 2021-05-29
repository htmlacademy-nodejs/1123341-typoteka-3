'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {name} = req.body;
    const foundCategory = await service.findByName(name);

    if (foundCategory) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: [`Категория уже существует`],
          data: req.body
        });

      return;
    }

    next();
  }
);
