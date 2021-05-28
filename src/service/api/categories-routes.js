'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../validators/scheme-validator`);
const categoryScheme = require(`../validators/schemes/category-scheme`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {sumUpEquals, userId} = req.query;
    const categories = await service.findAll({sumUpEquals, userId});

    return res
      .status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, schemeValidator(categoryScheme), async (req, res) => {
    const formData = req.body;
    // const {userId} = req.query;
    const newCategory = await service.add(formData);

    return res
      .status(HttpCode.CREATED)
      .json(newCategory);
  });
};
