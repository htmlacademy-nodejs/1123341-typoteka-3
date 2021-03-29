'use strict';

const {Op} = require(`sequelize`);
const {Aliase} = require(`../../constants`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [{model: this._Category, as: Aliase.CATEGORIES}],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
