'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/`, route);

  route.get(`/categories`, async (req, res) => {
    const {sumUpEquals, userId} = req.query;
    const categories = await service.findAll({sumUpEquals, userId});

    res
      .status(HttpCode.OK)
      .json(categories);
  });
};
