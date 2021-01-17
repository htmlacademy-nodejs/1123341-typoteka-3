'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`admin-publications`));
myRouter.get(`/comments`, (req, res) => res.render(`admin-comments`));

module.exports = myRouter;
