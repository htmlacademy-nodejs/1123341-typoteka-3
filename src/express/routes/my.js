'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(`admin-publications`));
myRouter.get(`/comments`, (req, res) => res.send(`admin-comments`));

module.exports = myRouter;
