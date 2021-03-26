'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  let articles = await api.getArticles();
  articles = articles.sort(compareDate);
  res.render(`./admin/admin-publications`, {articles, dayjs});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const sortedComments = articles
    .flatMap((article) => article.comments)
    .sort(compareDate);

  res.render(`./admin/admin-comments`, {sortedComments});
});

module.exports = myRouter;
