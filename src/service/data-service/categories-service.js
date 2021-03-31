"use strict";

const Sequelize = require(`sequelize`);
const {Aliase} = require(`../../constants`);

class CategoriesService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(sumUpEquals) {
    if (sumUpEquals) {
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

