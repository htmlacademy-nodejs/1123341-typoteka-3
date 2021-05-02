'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const path = require(`path`);
const authRouter = new Router();
const api = require(`../api`).getAPI();
const formReliability = require(`../../service/validators/form-reliability`);
const openedPopup = {
  AUTHENTIFICATION: `authentification`,
  REGISTRATION: `registration`
};

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

authRouter.get(`/register`, async (req, res) => {
  res.render(`registration`, {loginPopup: openedPopup.REGISTRATION});
});

authRouter.get(`/login`, async (req, res) => {
  req.session.hiddenValue = nanoid(10);
  const {hiddenValue} = req.session;
  const hashedValue = await bcrypt.hash(hiddenValue, saltRounds);
  res.render(`registration`, {hashedValue, loginPopup: openedPopup.AUTHENTIFICATION});
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

  try {
    await api.createUser(userData);
    res.redirect(`/login`);

  } catch (error) {
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];

    res.render(`registration`, {
      regErrorsMessages: details.map((errorDescription) => errorDescription.message),
      loginPopup: openedPopup.REGISTRATION
    });

    return;
  }
});

authRouter.post(`/login`, upload.none(), formReliability, async (req, res) => {
  const {body} = req;
  const memberData = {
    email: body[`member-email`],
    password: body[`member-pass`],
  };

  try {
    const loggedUser = await api.loginUser(memberData);
    req.session.isLogged = true;
    req.session.userAvatar = loggedUser.userAvatar;
    req.session.userName = loggedUser.userName;
    req.session.userSurname = loggedUser.userSurname;
    res.redirect(`/`);

  } catch (error) {
    let {data: details} = error.response;
    details = Array.isArray(details) ? details : [details];
    const {hiddenValue} = req.session;
    const hashedValue = await bcrypt.hash(hiddenValue, saltRounds);

    res.render(`registration`, {
      authErrorsMessages: details.map((errorDescription) => errorDescription.message),
      hashedValue,
      loginPopup: openedPopup.AUTHENTIFICATION
    });

    return;
  }
});

authRouter.get(`/logout`, async (req, res) => {
  req.session.destroy(() =>{
    res.redirect(`/login`);
  });
});

module.exports = authRouter;
