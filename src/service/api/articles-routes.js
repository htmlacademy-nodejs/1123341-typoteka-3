'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../validators/scheme-validator`);
const articleScheme = require(`../validators/schemes/article-scheme`);
const commentScheme = require(`../validators/schemes/comment-scheme`);
const articleExistence = require(`../validators/article-existence`);

module.exports = (app, articlesService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments, userId} = req.query;
    let articles;

    if (limit || offset) {
      articles = await articlesService.findPage(limit, offset);

    } else if (userId) {
      articles = await articlesService.findAll(comments, {userId});

    } else {
      articles = await articlesService.findAll(comments);
    }

    res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/category/:CategoryId`, async (req, res) => {
    const {CategoryId} = req.params;
    const {offset, limit, comments} = req.query;
    const articles = await articlesService.findAll(comments, {CategoryId, offset, limit});

    if (articles) {
      res
        .status(HttpCode.OK)
        .json(articles);

    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found articles belonging to category with id:${CategoryId}`);
    }
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articlesService.findOne(articleId, comments);

    if (article) {
      res
        .status(HttpCode.OK)
        .json(article);

    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id:${articleId}`);
    }
  });

  route.post(`/`, schemeValidator(articleScheme), async (req, res) => {
    const article = await articlesService.create(req.body);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, schemeValidator(articleScheme), async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articlesService.update(articleId, req.body);

    if (existArticle) {
      res
        .status(HttpCode.OK)
        .json(existArticle);

    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id:${articleId}`);
    }
  });

  route.delete(`/comments/:commentId`, async (req, res) => {
    const {commentId} = req.params;
    await commentService.drop(commentId);

    res
      .status(HttpCode.OK)
      .send(`Article Deleted`);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articlesService.drop(articleId);

    if (deletedArticle) {
      res
        .status(HttpCode.OK)
        .send(`Article Deleted`);

    } else {
      res.status(HttpCode.NOT_FOUND)
        .send(`We couldn't delete article with id:${articleId}, because he didn't exist`);
    }
  });

  route.get(`/:articleId/comments`, articleExistence(articlesService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll({articleId});
    res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.get(`/my/:userId/comments`, async (req, res) => {
    const {userId} = req.params;
    const comments = await commentService.findAll({userId});
    res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExistence(articlesService), async (req, res) => {
    const {commentId} = req.params;
    const deleteComment = await commentService.drop(commentId);

    if (deleteComment) {
      res
        .status(HttpCode.OK)
        .send(`Comment Deleted`);

    } else {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
  });

  route.post(`/:articleId/comments`, [articleExistence(articlesService), schemeValidator(commentScheme)], async (req, res) => {
    const {articleId} = req.params;
    const {userId} = req.query;

    if (userId) {
      const comment = await commentService.create(articleId, userId, req.body);

      res
      .status(HttpCode.CREATED)
      .json(comment);

    } else {
      res
        .status(HttpCode.BAD_REQUEST)
        .send(`There is no registered user`);
    }
  });
};

