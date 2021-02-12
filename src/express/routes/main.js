'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

// Главная страница
mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);

  const categoriesCapacity = categories
    .map((category) => articles
      .filter((article) => article.category
        .includes(category)).length
    );

  res.render(`./main/main`, {articles, categories, categoriesCapacity});
});


mainRouter.get(`/register`, (req, res) => res.render(`registration`));
mainRouter.get(`/login`, (req, res) => res.render(`registration`));
mainRouter.get(`/search`, (req, res) => res.render(`./search/search-1`));
mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
