'use strict';

const {Aliase} = require(`../../constants`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
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
      include: [Aliase.CATEGORIES],
      distinct: true
    });
    return {allArticlesSum: count, articlesOfPage: rows};
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = ArticleService;
