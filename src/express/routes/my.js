'use strict';

const {Router} = require(`express`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`./admin/admin-publications`, {articles: articles.sort(compareDate)});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`./admin/admin-comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
