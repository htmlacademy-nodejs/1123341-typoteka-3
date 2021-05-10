'use strict';

const dayjs = require(`dayjs`);
const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);

const {JWT_ACCESS_SECRET} = process.env;

myRouter.get(`/`, async (req, res) => {
  let articles = await api.getArticles();
  articles = articles.sort(compareDate);
  res.render(`./admin/admin-publications`, {articles, dayjs});
});

myRouter.get(`/comments`, authenticateJwt, async (req, res) => {
  const token = req.cookies[`authorization`];
  const userData = jwt.verify(token, JWT_ACCESS_SECRET);

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
