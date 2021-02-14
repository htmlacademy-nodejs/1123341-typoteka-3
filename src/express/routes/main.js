'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

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

mainRouter.get(`/search`, async (req, res) => {

  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search/search-2`, {
      results,
      searchText: search
    });

  } catch (error) {
    res.render(`search/search-2`, {
      results: []
    });
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));
mainRouter.get(`/login`, (req, res) => res.render(`registration`));
mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
