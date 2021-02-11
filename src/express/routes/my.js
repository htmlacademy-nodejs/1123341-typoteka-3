'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`./admin/admin-publications`, {articles});
});

myRouter.get(`/comments`, (req, res) => res.render(`./admin/admin-comments`));

module.exports = myRouter;
