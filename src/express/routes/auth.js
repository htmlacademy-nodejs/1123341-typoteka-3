'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const authRouter = new Router();
const api = require(`../api`).getAPI();
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

authRouter.get(`/register`, (req, res) => {
  res.render(`registration`);
});

authRouter.post(`/register`, upload.single(`user-avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    userAvatar: file ? file.filename : ``,
    userName: body[`user-name`],
    userSurname: body[`user-surname`],
    email: body[`user-email`],
    password: body[`user-password`],
    repeat: body[`user-password-again`]
  };

  console.log(userData);

  try {
    await api.createUser(userData);
    res.redirect(`/login`);

  } catch (error) {
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    res.render(`registration`, {
      errorsMessages: details.map((errorDescription) => errorDescription.message)}
    );

    return;
  }
});

authRouter.get(`/login`, async (req, res) => {
  res.render(`login`);
});

module.exports = authRouter;
