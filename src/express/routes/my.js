'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const tokenRelevance = require(`../../service/validators/token-relevance`);

const upload = multer();

myRouter.get(`/`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {userData} = req;
  const {id: userId} = req.userData;

  let articles = await api.getArticles({userId});
  articles = articles.sort(compareDate);

  res.render(`./admin/admin-publications`, {
    articles,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

myRouter.get(`/categories`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {userData} = req;
  const categories = await api.getCategories();

  res.render(`./admin/admin-categories`, {
    categories,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

myRouter.post(`/categories/edit/:categoryId`, [tokenRelevance, authenticateJwt], upload.none(), async (req, res) => {
  const {body, userData} = req;
  const {categoryId} = req.params;

  try {
    await api.updateCategory({categoryId, name: body.category});
    res.redirect(`/my/categories`);

  } catch (error) {
    const categories = await api.getCategories();
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    res.render(`./admin/admin-categories`, {
      errorsMessages: details.map((errorDescription) => errorDescription.message),
      categories,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname
    });
  }
});

myRouter.post(`/categories/add`, [tokenRelevance, authenticateJwt], upload.none(), async (req, res) => {
  const {body, userData} = req;

  try {
    await api.createCategory({userId: userData.id, name: body.category});
    res.redirect(`/my/categories`);

  } catch (error) {
    const categories = await api.getCategories();
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    res.render(`./admin/admin-categories`, {
      errorsMessages: details.map((errorDescription) => errorDescription.message),
      categories,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname
    });
  }
});

myRouter.get(`/articles/delete/:id`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {id: articleId} = req.params;

  try {
    await api.deleteArticle({articleId});
    res.redirect(`/my`);

  } catch (error) {
    console.log(error);
    return;
  }
});

myRouter.get(`/categories/delete/:id`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {id: categoryId} = req.params;
  const {userData} = req;

  try {
    await api.deleteCategory({categoryId});
    res.redirect(`/my/categories`);

  } catch (error) {
    const categories = await api.getCategories({userId: userData.id});

    res.render(`./admin/admin-categories`, {
      errorsMessages: [error.response.data],
      categories,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname
    });
  }
});

myRouter.get(`/comments/delete/:id`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {id: commentId} = req.params;

  try {
    await api.deleteComment({commentId});
    res.redirect(`/my/comments`);

  } catch (error) {
    console.log(error);
    return;
  }
});

myRouter.get(`/comments`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {userData} = req;
  const comments = await api.getUsersComments(userData.id);
  const sortedComments = comments.sort(compareDate);

  res.render(`./admin/admin-comments`, {
    dayjs,
    sortedComments,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

module.exports = myRouter;
