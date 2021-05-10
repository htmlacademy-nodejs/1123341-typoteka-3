"use strict";

const defineModels = require(`../models`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const {Aliase} = require(`../../constants`);

module.exports = async (sequelize, articles, categories, users) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoriesTable = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
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

  const userPromises = users
    .map(async (user) => {
      const {password} = user;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedFormData = {...user, password: hashedPassword};
      delete updatedFormData.repeat;
      const newUser = await User.create(updatedFormData);
      return newUser.get();
    });

  await Promise.all([...articlesPromises, ...userPromises]);
};
