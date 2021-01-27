'use strict';

const {Router} = require(`express`);

const articles = require(`../api/articles`);
const categories = require(`../api/categories`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SerachService
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  articles(app, new ArticlesService(mockData), new CommentsService());
  search(app, new SerachService(mockData));
})();

module.exports = app;
