'use strict';

const {Router} = require(`express`);

const articles = require(`../api/articles-routes`);
const categories = require(`../api/categories-routes`);
const search = require(`../api/search-routes`);
const user = require(`../api/user-routes`);

const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService,
  UserService,
  RefreshTokenService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
defineModels(sequelize);

const router = new Router();

(async () => {
  categories(router, new CategoriesService(sequelize));
  articles(router, new ArticlesService(sequelize), new CommentsService(sequelize));
  search(router, new SearchService(sequelize));
  user(router, new UserService(sequelize));
})();

module.exports = {
  router,
  refreshTokenService: new RefreshTokenService(sequelize)
};
