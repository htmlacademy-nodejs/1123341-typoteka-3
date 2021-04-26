"use strict";

const defineCategory = require(`./category-model`);
const defineComment = require(`./comment-model`);
const defineArticle = require(`./article-model`);
const defineArticleCategory = require(`./article-category-model`);
const defineUser = require(`./user-model`);
const {Aliase} = require(`../../constants`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLES_CATEGORIES});

  return {Category, Comment, Article, User, ArticleCategory};
};

module.exports = define;
