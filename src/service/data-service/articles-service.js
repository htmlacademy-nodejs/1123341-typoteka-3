'use strict';

const {Aliase} = require(`../../constants`);
const Sequelize = require(`sequelize`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    // в массив models попадают не наименование моделей, а их алиасы
    const models = needComments
      ? [Aliase.CATEGORIES, Aliase.COMMENTS]
      : [Aliase.CATEGORIES];

    const articles = await this._Article.findAll({include: models});
    return articles.map((item) => item.get());
  }

  async findOne(id, needComments) {
    const models = needComments
      ? [Aliase.CATEGORIES, Aliase.COMMENTS]
      : [Aliase.CATEGORIES];

    const article = await this._Article.findByPk(id, {include: models});
    return article;
  }

  async findPage(limit, offset) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      distinct: true,
      order: [[`createdAt`, `DESC`]],
    });

    // таблица comments(articleId) связана с таблицей articles(id)
    // вся структура даст нам сумму идентичных comments(userId) и запишет напротив articles(id)
    const articles = await this._Article.findAll({
      attributes: [
        [`id`, `articleId`], // as
        `title`,
        `picture`,
        `announce`,
        `fullText`,
        `createdAt`,
        `updatedAt`,
        `userId`,
        [Sequelize.fn(`COUNT`, `*`), `sumOfComments`]
      ],
      group: [Sequelize.col(`Article.id`)],
      order: [[Sequelize.fn(`COUNT`, `*`), `DESC`]],
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: []
      }]
    });

    const popularArticles = articles.map((article) => article.get()).slice(0, 4);

    const comments = await this._Comment.findAll({order: [[`createdAt`, `DESC`]]});
    const lastComments = comments.map((comment) => comment.get()).slice(0, 4);

    const users = await this._User.findAll();
    const allUsers = users.map((user) => user.get());

    return {
      allArticlesSum: count,
      articlesOfPage: rows,
      popularArticles,
      lastComments,
      allUsers
    };
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = ArticleService;
