'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`./main/main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));
mainRouter.get(`/login`, (req, res) => res.render(`registration`));
mainRouter.get(`/search`, (req, res) => res.render(`./search/search-1`));
mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
