'use strict';

const {Op} = require(`sequelize`);
const Sequelize = require(`sequelize`);
const {Aliase} = require(`../../constants`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
  }

  // ???? осталась проблема с регистрами у русских слов
  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: Sequelize.where(
          Sequelize.fn(`LOWER`, Sequelize.col(`title`)),
          {
            [Op.iLike]: `%${searchText}%`
          }
      ),
      include: [{model: this._Category, as: Aliase.CATEGORIES}],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
