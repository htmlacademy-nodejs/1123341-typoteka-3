'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const path = require(`path`);
const {categories} = require(`../../constants`);

const UPLOAD_DIR = path.resolve(__dirname, `../upload/img/`);

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
  const articleData = {
    picture: file.filename,
    createdDate: body[`public-date`],
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    category: [`Разное`] // ????? надо исправить
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/add`, async (req, res) => {
  const allCategories = await api.getCategories(); // ?????? пока не используется
  res.render(`./admin/admin-add-new-post-empty`, {allCategories});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  article.createdDate = dayjs(article.createdDate).format(`DD.MM.YYYY`);
  res.render(`./admin/admin-add-new-post`, {article, categories}); // ?????? categories пока не используем как надо
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`./publications-by-category`));
articlesRouter.get(`/:id`, (req, res) => res.render(`./post/post-user`));

module.exports = articlesRouter;
