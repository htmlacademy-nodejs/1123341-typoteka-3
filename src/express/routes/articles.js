'use strict';

const dayjs = require(`dayjs`);
const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {compareDate} = require(`../../utils`);
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);

const UPLOAD_DIR = path.resolve(__dirname, `../upload/img/`);
const {JWT_ACCESS_SECRET} = process.env;

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

articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const token = req.cookies[`authorization`];
  let userData = token ? jwt.verify(token, JWT_ACCESS_SECRET) : {isLogged: false};

  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: body.category || [`2`, `3`], // ?????? неправильно 100%
    userId: userData.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`./publications-by-category`));

articlesRouter.get(`/add`, authenticateJwt, async (req, res) => {
  const token = req.cookies[`authorization`];
  let userData = token ? jwt.verify(token, JWT_ACCESS_SECRET) : {isLogged: false};
  // const categories = await api.getCategories();

  res.render(`./admin/admin-add-new-post-empty`, {
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar || `none`,
    userName: userData.userName || `none`,
    userSurname: userData.userSurname || `none`,
  });
});

articlesRouter.get(`/edit/:id`, authenticateJwt, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle({id}),
    api.getCategories()
  ]);
  // ???????? манипуляции с categories непонятны
  res.render(`./admin/admin-add-new-post`, {article, categories, dayjs});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const token = req.cookies[`authorization`];
  let userData = null;

  try {
    const decodedToken = jwt.verify(token, JWT_ACCESS_SECRET);
    userData = token ? decodedToken : {isLogged: false};

  } catch (err) {
    userData = {isLogged: false};
  }


  const {id} = req.params;
  const [{article, allUsers}, categories] = await Promise.all([
    api.getArticle({id, comments: true}),
    api.getCategories({sumUpEquals: true})
  ]);

  const articleComments = article.comments.sort(compareDate);

  res.render(`./post/post-user`, {
    article,
    articleComments,
    categories,
    dayjs,
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar || `none`,
    userName: userData.userName || `none`,
    userSurname: userData.userSurname || `none`,
    allUsers
  });
});


articlesRouter.post(`/:id`, upload.none(), async (req, res) => {
  const {body, params} = req;
  const token = req.cookies[`authorization`];
  const userData = jwt.verify(token, JWT_ACCESS_SECRET);

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
      userAvatar: userData.userAvatar || `none`,
      userName: userData.userName || `none`,
      userSurname: userData.userSurname || `none`,
      allUsers
    });

    return;
  }
});

module.exports = articlesRouter;
