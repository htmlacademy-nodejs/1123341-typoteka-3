'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {sumUpEquals} = req.query;
    const categories = await service.findAll(sumUpEquals);

    res
      .status(HttpCode.OK)
      .json(categories);
  });
};
