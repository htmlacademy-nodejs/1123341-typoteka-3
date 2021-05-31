"use strict";

const defineCategory = require(`./category-model`);
const defineComment = require(`./comment-model`);
const defineArticle = require(`./article-model`);
const defineArticleCategory = require(`./article-category-model`);
const defineUser = require(`./user-model`);
const defineRefreshToken = require(`./token-model`);
const {Aliase} = require(`../../constants`);

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const RefreshToken = defineRefreshToken(sequelize);

  User.hasOne(RefreshToken, {foreignKey: `userId`});
  RefreshToken.belongsTo(User, {foreignKey: `userId`});

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `CASCADE`
  });
  Comment.belongsTo(Article, {foreignKey: `articleId`, onDelete: `CASCADE`});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {foreignKey: `userId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLES_CATEGORIES});

  return {Category, Comment, Article, User, ArticleCategory, RefreshToken};
};

module.exports = defineModels;
