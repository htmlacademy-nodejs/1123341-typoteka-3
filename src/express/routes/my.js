'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {compareDate} = require(`../../utils`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const tokenRelevance = require(`../../service/validators/token-relevance`);
const creatorValidator = require(`../../service/validators/creator-validator`);

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
  const categories = await api.getCategories({userId: userData.id});

  res.render(`./admin/admin-categories`, {
    categories,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname
  });
});

myRouter.post(`/categories/add`, tokenRelevance, upload.none(), async (req, res) => {
  const {body, userData} = req;

  try {
    await api.createCategory({userId: userData.id, name: body.category});
    res.redirect(`/my/categories`);

  } catch (error) {
    const categories = await api.getCategories({userId: userData.id});
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

myRouter.get(`/articles/delete/:id`, async (req, res) => {
  const {id: articleId} = req.params;

  try {
    await api.deleteArticle({articleId});
    res.redirect(`/my`);

  } catch (error) {
    console.log(error);
    return;
  }
});

myRouter.get(`/comments`, [tokenRelevance, authenticateJwt, creatorValidator(api)], async (req, res) => {
  const {userData} = req;
  const articles = await api.getArticles({comments: true});
  const sortedComments = articles
    .flatMap((article) => article.comments)
    .sort(compareDate);

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
