'use strict';

const dayjs = require(`dayjs`);
const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);

const {ARTICLES_PER_PAGE} = require(`../../constants`);
const {JWT_ACCESS_SECRET} = process.env;

mainRouter.get(`/`, authenticateJwt, async (req, res) => {
  const token = req.cookies[`authorization`];
  const userData = jwt.verify(token, JWT_ACCESS_SECRET);

  let {page = 1} = req.query;
  page = parseInt(page, 10);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{allArticlesSum, articlesOfPage}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories({sumUpEquals: true})
  ]);

  const totalPages = Math.ceil(allArticlesSum / ARTICLES_PER_PAGE);
  res.render(`./main/main-page-admin-pager`, {
    articles: articlesOfPage,
    page,
    totalPages,
    categories,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
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

mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
