"use strict";

const Sequelize = require(`sequelize`);
const {Aliase} = require(`../../constants`);

class CategoriesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async add(formData) {
    const newCategory = await this._Category.create(formData);
    return newCategory.get();
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findArticlesByCategory(CategoryId) {
    const articles = await this._ArticleCategory.findAll({
      where: {
        CategoryId
      }
    });

    return articles.map((article) => article.get());
  }

  async findAll({sumUpEquals, userId}) {
    if (userId) {
      const articles = await this._Article.findAll({where: {userId}});
      const articlesId = articles.map((article) => article.get().id);
      const articlesCategories = await this._ArticleCategory.findAll({
        where: {ArticleId: {[Sequelize.Op.in]: articlesId}}
      });
      const usersCategoriesId = articlesCategories.map((item) => item.get().CategoryId);
      const categories = await this._Category.findAll({
        where: {id: {[Sequelize.Op.in]: usersCategoriesId}}
      });

      return categories.map((category) => category.get());

    } else if (sumUpEquals) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, `*`), `sumOfEquals`]
        ],

        group: [Sequelize.col(`Category.id`)],

        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });

      return categories.map((category) => category.get());

    } else {
      const categories = this._Category.findAll({raw: true});

      return categories;
    }
  }
}

module.exports = CategoriesService;

