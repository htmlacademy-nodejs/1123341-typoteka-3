'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = parseInt(page, 10);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{allArticlesSum, articlesOfPage}, categories] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories({sumUpEquals: true})
  ]);

  const totalPages = Math.ceil(allArticlesSum / ARTICLES_PER_PAGE);
  res.render(`./main/main-page-admin-pager`, {articles: articlesOfPage, page, totalPages, categories, dayjs});
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
