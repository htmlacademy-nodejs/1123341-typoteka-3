'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`./main/main`));
mainRouter.get(`/register`, (req, res) => res.render(`registration`));
mainRouter.get(`/login`, (req, res) => res.render(`registration`));
mainRouter.get(`/search`, (req, res) => res.render(`./search/search-1`));
mainRouter.get(`/categories`, (req, res) => res.render(`./admin/admin-categories`));

module.exports = mainRouter;
