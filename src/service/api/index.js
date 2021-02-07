'use strict';

const {Router} = require(`express`);

const articles = require(`../api/articles-controller`);
const categories = require(`../api/categories-controller`);
const search = require(`../api/search-controller`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  articles(app, new ArticlesService(mockData), new CommentsService());
  search(app, new SearchService(mockData));
})();

module.exports = app;
