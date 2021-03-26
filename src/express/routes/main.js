'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories(true)
  ]);

  res.render(`./main/main`, {articles, categories});
});

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const articals = await api.search(search);
    res.render(`search/search-2`, {
      articals,
      searchText: search,
      dayjs
    });

  } catch (error) {
    res.render(`search/search-2`, {
      articals: [],
      dayjs
    });
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));
mainRouter.get(`/login`, (req, res) => res.render(`registration`));
mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
