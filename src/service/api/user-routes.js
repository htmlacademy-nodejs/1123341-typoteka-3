'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../validators/scheme-validator`);
const alreadyRegister = require(`../validators/already-register`);
const newUserSchema = require(`../validators/schemes/user-scheme`);
const loggedUserSchema = require(`../validators/schemes/member-scheme`);
const authenticate = require(`../validators/authenticate`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/`, route);

  route.get(`/user`, async (req, res) => {
    const result = await userService.findAll();
    res
      .status(HttpCode.OK)
      .json(result);
  });

  route.post(`/user`,
      [
        schemeValidator(newUserSchema),
        alreadyRegister(userService)
      ],

      async (req, res) => {
        const formData = req.body;
        const newUser = await userService.add(formData);

        return res
          .status(HttpCode.CREATED)
          .json(newUser);
      }
  );

  route.post(`/login`,
      [
        schemeValidator(loggedUserSchema),
        authenticate(userService)
      ],

      async (req, res) => {
        const formData = req.body;
        const loggedUser = await userService.findByEmail(formData.email);

        return res
          .status(HttpCode.OK)
          .json(loggedUser);
      }
  );
};
