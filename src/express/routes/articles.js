'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`publications-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`./admin/admin-add-new-post-empty`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`.admin/admin-add-new-post`));
articlesRouter.get(`/:id`, (req, res) => res.render(`./post/post-user`));

module.exports = articlesRouter;
