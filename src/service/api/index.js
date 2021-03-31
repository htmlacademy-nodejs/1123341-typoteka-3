'use strict';

const {Router} = require(`express`);

const articles = require(`../api/articles-routes`);
const categories = require(`../api/categories-routes`);
const search = require(`../api/search-routes`);

const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
defineModels(sequelize);

const app = new Router();

(async () => {
  categories(app, new CategoriesService(sequelize));
  articles(app, new ArticlesService(sequelize), new CommentsService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
