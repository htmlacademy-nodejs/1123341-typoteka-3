'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const tokenRelevance = require(`../../service/validators/token-relevance`);

const {ARTICLES_PER_PAGE} = require(`../../constants`);

mainRouter.get(`/`, tokenRelevance, async (req, res) => {
  const {userData} = req;

  let {page = 1} = req.query;
  page = parseInt(page, 10);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{allArticlesSum, articlesOfPage, popularArticles, lastComments, allUsers}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories({sumUpEquals: true})
  ]);

  const totalPages = Math.ceil(allArticlesSum / ARTICLES_PER_PAGE);

  res.render(`./main/main`, {
    articles: articlesOfPage,
    page,
    totalPages,
    categories,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar || `none`,
    userName: userData.userName || `none`,
    userSurname: userData.userSurname || `none`,
    lastComments,
    popularArticles,
    allUsers
  });
});

mainRouter.get(`/search`, tokenRelevance, async (req, res) => {
  const {userData} = req;

  try {
    const {search} = req.query;
    const articals = await api.search(search);
    res.render(`search`, {
      articals,
      searchText: search,
      dayjs,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname,
    });

  } catch (error) {
    // когда перехожу на страницу поиска
    const articals = error.config.params.query === undefined ? undefined : [];

    res.render(`search`, {
      articals,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname,
    });
  }
});

mainRouter.get(`/categories`, authenticateJwt, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
