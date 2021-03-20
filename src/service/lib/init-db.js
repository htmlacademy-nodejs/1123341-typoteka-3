"use strict";

const defineModels = require(`../models`);
const {Aliase} = require(`../../constants`);

module.exports = async (sequelize, articles, fullMockData) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoriesTable = await Category.bulkCreate(
      fullMockData.categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoriesTable.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});


  const articlesPromises = articles
    .map(async (article) => {
      const articlesTable = await Article.create(article, {include: [Aliase.COMMENTS]});

      await articlesTable.addCategories(
          article.categories.map((name) => categoryIdByName[name])
      );
    });

  await Promise.all(articlesPromises);
};
