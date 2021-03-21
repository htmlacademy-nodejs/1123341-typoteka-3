"use strict";

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
  }

  async findAll() {
    const categories = await this._Category.findAll({raw: true});
    return categories;
  }
}

module.exports = CategoryService;

// 'use strict';

// const Sequelize = require(`sequelize`);
// const Aliase = require(`../../constants`);

// class CategoryService {
//   constructor(sequelize) {
//     this._Category = sequelize.models.Category;
//     this._ArticleCategory = sequelize.models.ArticleCategory;
//   }

//   async findAll(needCount) {
//     if (needCount) {
//       const result = await this._Category.findAll({
//         attributes: [
//           `id`,
//           `name`,
//           [Sequelize.fn(`COUNT`, `*`), `count`]
//         ],

//         group: [Sequelize.col(`Category.id`)],

//         include: [{
//           model: this._ArticleCategory,
//           as: Aliase.ARTICLES_CATEGORIES,
//           attributes: []
//         }]
//       });
//       return result.map((it) => it.get());

//     } else {
//       return this._Category.findAll({raw: true});
//     }
//   }
// }

// module.exports = CategoryService;
