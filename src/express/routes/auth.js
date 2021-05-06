'use strict';

const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const path = require(`path`);
const api = require(`../api`).getAPI();
const formReliability = require(`../../service/validators/form-reliability`);
const authenticateJwt = require(`../../service/validators/authenticate-jwt`);
const {makeTokens} = require(`../../service/lib/jwt-helper`);

const OpenedPopup = {
  AUTHENTIFICATION: `authentification`,
  REGISTRATION: `registration`
};

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, DB_FORM_RELIABILITY} = process.env;
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


module.exports = (app, refreshTokenService) => {
  const authRouter = new Router();
  app.use(`/`, authRouter);

  authRouter.get(`/register`, async (req, res) => {
    res.render(`registration`, {loginPopup: OpenedPopup.REGISTRATION});
  });

  authRouter.get(`/login`, async (req, res) => {
    const hashedValue = await bcrypt.hash(DB_FORM_RELIABILITY, saltRounds);
    res.render(`registration`, {hashedValue, loginPopup: OpenedPopup.AUTHENTIFICATION});
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
        loginPopup: OpenedPopup.REGISTRATION
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
      const tokenByUser = await refreshTokenService.find(loggedUser.id);

      if (tokenByUser) {
        const {token} = tokenByUser;
        const userData = jwt.verify(token, JWT_REFRESH_SECRET);
        const {id} = userData;

        const {accessToken, refreshToken} = makeTokens({
          id,
          userAvatar: loggedUser.userAvatar,
          userName: loggedUser.userName,
          userSurname: loggedUser.userSurname,
          isLogged: true
        });

        await refreshTokenService.delete(id);
        await refreshTokenService.add(id, refreshToken);

        res.cookie(`authorization`, accessToken);

      } else {
        const {accessToken, refreshToken} = makeTokens({
          id: loggedUser.id,
          userAvatar: loggedUser.userAvatar,
          userName: loggedUser.userName,
          userSurname: loggedUser.userSurname,
          isLogged: true
        });

        await refreshTokenService.add(loggedUser.id, refreshToken);
        res.cookie(`authorization`, accessToken);
      }

      res.redirect(`/`);

    } catch (error) {
      let {data: details} = error.response;
      details = Array.isArray(details) ? details : [details];
      const hashedValue = await bcrypt.hash(DB_FORM_RELIABILITY, saltRounds);

      res.render(`registration`, {
        authErrorsMessages: details.map((errorDescription) => errorDescription.message),
        hashedValue,
        loginPopup: OpenedPopup.AUTHENTIFICATION
      });

      return;
    }
  });

  authRouter.get(`/logout`, authenticateJwt, async (req, res) => {
    const token = req.cookies[`authorization`];
    const userData = jwt.verify(token, JWT_ACCESS_SECRET);
    const {id} = userData;
    refreshTokenService.delete(id);
    res.clearCookie(`authorization`);
    res.redirect(`/login`);
  });
};
