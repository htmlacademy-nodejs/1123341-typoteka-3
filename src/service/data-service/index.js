'use strict';

const CategoriesService = require(`./categories-service`);
const ArticlesService = require(`./articles-service`);
const CommentsService = require(`./comments-service`);
const SearchService = require(`./search-service`);
const UserService = require(`./users-service`);
const RefreshTokenService = require(`./refresh-token`);

module.exports = {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService,
  UserService,
  RefreshTokenService
};
