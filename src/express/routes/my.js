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
  res.render(`./admin/admin-comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
