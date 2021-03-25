'use strict';

const dayjs = require(`dayjs`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);

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
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: body.category
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`./publications-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  // ???????? попадают ли сюда categories
  res.render(`./admin/admin-add-new-post-empty`, {categories, dayjs});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  // ???????? манипуляции с categories непонятны
  res.render(`./admin/admin-add-new-post`, {article, categories, dayjs});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, allNotes] = await Promise.all([
    api.getArticle(id, true),
    api.getArticles()
  ]);

  res.render(`./post/post-user`, {article, allNotes, dayjs});
});

module.exports = articlesRouter;
