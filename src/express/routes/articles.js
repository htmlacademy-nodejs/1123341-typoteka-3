'use strict';

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
  console.log(req);
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`./admin/admin-add-new-post-empty`, {categories});
});


articlesRouter.get(`/category/:id`, (req, res) => res.render(`publications-by-category`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`.admin/admin-add-new-post`));
articlesRouter.get(`/:id`, (req, res) => res.render(`./post/post-user`));

module.exports = articlesRouter;
