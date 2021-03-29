'use strict';
// ?????? исправить модуль
const {Router} = require(`express`);

const articles = require(`../api/articles-routes`);
const categories = require(`../api/categories-routes`);
const search = require(`../api/search-routes`);

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
  articles(app, new ArticlesService(mockData), new CommentsService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
