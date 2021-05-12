"use strict";

const defineModels = require(`../models`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const {Aliase} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);

module.exports = async (sequelize, articles, categories, users) => {
  const {Category, Article, User, Comment} = defineModels(sequelize);
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

      return articlesTable;
    });

  const userPromises = users
    .map(async (user) => {
      const {password} = user;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedFormData = {...user, password: hashedPassword};
      delete updatedFormData.repeat;
      const newUser = await User.create(updatedFormData, {include: [Aliase.COMMENTS, Aliase.ARTICLES]});
      return newUser;
    });

  const usersModels = await Promise.all([...userPromises]);
  const articlesModels = await Promise.all([...articlesPromises]);
  const commentsModels = await Comment.findAll({raw: true});

  const articlesIdArray = articlesModels.reduce((acc, next) => {
    acc.push(next.id);
    return acc;
  }, []);

  const commentsIdArray = commentsModels.reduce((acc, next) => {
    acc.push(next.id);
    return acc;
  }, []);

  for (let i = 0; i < articlesIdArray.length; i++) {
    usersModels[getRandomInt(0, usersModels.length - 1)].addArticles(articlesIdArray[i]);
  }

  for (let i = 0; i < commentsIdArray.length; i++) {
    usersModels[getRandomInt(0, usersModels.length - 1)].addComments(commentsIdArray[i]);
  }

};
