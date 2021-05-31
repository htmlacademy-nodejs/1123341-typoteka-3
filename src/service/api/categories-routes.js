'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../validators/scheme-validator`);
const categoryScheme = require(`../validators/schemes/category-scheme`);
const articlesFinder = require(`../validators/articles-finder`);
const categoryExistence = require(`../validators/category-existence`);

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

  route.post(`/`,
      [
        schemeValidator(categoryScheme),
        categoryExistence(service)
      ],

      async (req, res) => {
        // const {userId} = req.query;
        const newCategory = await service.add(req.body);

        return res
          .status(HttpCode.CREATED)
          .json(newCategory);
      }
  );

  route.put(`/:categoryId`,
      [
        schemeValidator(categoryScheme),
        categoryExistence(service)
      ],

      async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.update(categoryId, req.body);

        return res
            .status(HttpCode.OK)
            .json(category);
      }
  );

  route.delete(`/:categoryId`, articlesFinder(service), async (req, res) => {
    const {categoryId} = req.params;
    await service.drop(categoryId);

    return res
      .status(HttpCode.OK)
      .send(`Category Deleted`);
  });
};
