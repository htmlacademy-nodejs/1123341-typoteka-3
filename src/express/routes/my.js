'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const tokenRelevance = require(`../../service/validators/token-relevance`);
const creatorValidator = require(`../../service/validators/creator-validator`);

myRouter.get(`/`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {userData} = req;
  const {id: userId} = req.userData;

  let articles = await api.getArticles({userId});
  articles = articles.sort(compareDate);

  res.render(`./admin/admin-publications`, {
    articles,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

myRouter.get(`/articles/delete/:id`, async (req, res) => {
  const {id: articleId} = req.params;

  try {
    await api.deleteArticle({articleId});
    res.redirect(`/my`);

  } catch (error) {
    console.log(error);
    return;
  }
});

myRouter.get(`/comments`, [tokenRelevance, authenticateJwt, creatorValidator(api)], async (req, res) => {
  const {userData} = req;
  const articles = await api.getArticles({comments: true});
  const sortedComments = articles
    .flatMap((article) => article.comments)
    .sort(compareDate);

  res.render(`./admin/admin-comments`, {
    dayjs,
    sortedComments,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

module.exports = myRouter;
