'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {compareDate} = require(`../../utils`);
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const tokenRelevance = require(`../../service/validators/token-relevance`);
const creatorValidator = require(`../../service/validators/creator-validator`);

const UPLOAD_DIR = path.resolve(__dirname, `../upload/img/`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const articlesRouter = new Router();
const api = require(`../api`).getAPI();

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.post(`/add`, tokenRelevance, upload.single(`avatar`), async (req, res) => {
  const {body, file, userData} = req;
  const fullText = body[`full-text`] ? body[`full-text`] : ``;
  const picture = file ? file.filename : ``;

  const articleData = {
    userId: userData.id,
    picture,
    title: body.title,
    announce: body.announce,
    fullText,
    categories: body.category || [`2`, `3`], // ?????? неправильно 100%
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

  } catch (error) {
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    res.render(`./admin/admin-add-new-post-empty`, {
      dayjs,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname,
      errorsMessages: details.map((errorDescription) => errorDescription.message),
    });

    return;
  }
});

articlesRouter.get(`/category/:id`, tokenRelevance, async (req, res) => {
  const {userData} = req;
  const {id} = req.params;
  let {page = 1} = req.query;
  page = parseInt(page, 10);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{allArticlesSum, articlesOfPage}, categories] = await Promise.all([
    api.getArticlesByCategory({id, limit, offset, comments: true}),
    api.getCategories({sumUpEquals: true})
  ]);

  const totalPages = Math.ceil(allArticlesSum / ARTICLES_PER_PAGE);

  res.render(`./publications-by-category`, {
    page,
    totalPages,
    dayjs,
    articles: articlesOfPage,
    activeCategory: Number(id),
    categories,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname,
  });
});

articlesRouter.get(`/add`, [tokenRelevance, authenticateJwt], async (req, res) => {
  const {userData} = req;
  // const categories = await api.getCategories(); должны быть

  res.render(`./admin/admin-add-new-post-empty`, {
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname,
  });
});

articlesRouter.get(`/edit/:id`, [tokenRelevance, authenticateJwt, creatorValidator(api)], async (req, res) => {
  const {userData} = req;
  const {id} = req.params;
  const [{article}, categories] = await Promise.all([
    api.getArticle({id}),
    api.getCategories()
  ]);

  res.render(`./admin/admin-add-new-post`, {
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname,
    article,
    categories,
    dayjs
  });
});

articlesRouter.post(`/edit/:id`, tokenRelevance, upload.single(`avatar`), async (req, res) => {
  const {id} = req.params;
  const {body, file, userData} = req;
  const fullText = body[`full-text`] ? body[`full-text`] : ``;
  const picture = file ? file.filename : ``;

  const articleData = {
    userId: userData.id,
    picture,
    title: body.title,
    announce: body.announce,
    fullText,
    categories: body.category || [`2`, `3`], // ?????? неправильно 100%
  };

  try {
    await api.updateArticle({articleId: id, articleData});
    res.redirect(`/my`);

  } catch (error) {
    console.log(error.response);
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    const [{article}, categories] = await Promise.all([
      api.getArticle({id}),
      api.getCategories()
    ]);

    res.render(`./admin/admin-add-new-post`, {
      article,
      categories,
      dayjs,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname,
      errorsMessages: details.map((errorDescription) => errorDescription.message),
    });

    return;
  }
});

articlesRouter.get(`/:id`, tokenRelevance, async (req, res) => {
  const {userData} = req;
  const {id} = req.params;

  const [{article, allUsers}, categories] = await Promise.all([
    api.getArticle({id, comments: true}),
    api.getCategories({sumUpEquals: true})
  ]);

  res.render(`./post/post-user`, {
    article,
    articleComments: article.comments.sort(compareDate),
    categories,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    userName: userData.userName,
    userSurname: userData.userSurname,
    allUsers
  });
});


articlesRouter.post(`/:id`, tokenRelevance, upload.none(), async (req, res) => {
  const {body, params, userData} = req;

  try {
    await api.createComment(params.id, userData.id, {text: body[`user-comment`]});
    res.redirect(`back`);

  } catch (error) {
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    const {id} = req.params;
    const [{article, allUsers}, categories] = await Promise.all([
      api.getArticle({id, comments: true}),
      api.getCategories({sumUpEquals: true})
    ]);

    const articleComments = article.comments.sort(compareDate);

    res.render(`./post/post-user`, {
      errorsMessages: details.map((errorDescription) => errorDescription.message),
      article,
      articleComments,
      categories,
      dayjs,
      isLogged: userData.isLogged,
      userAvatar: userData.userAvatar,
      userName: userData.userName,
      userSurname: userData.userSurname,
      allUsers
    });

    return;
  }
});

module.exports = articlesRouter;
