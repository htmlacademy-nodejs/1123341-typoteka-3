'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../validators/article-validator`);
const articleExistence = require(`../validators/article-existence`);
const commentValidator = require(`../validators/comment-validator`);

module.exports = (app, articlesService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articlesService.findAll(comments);
    res
      .status(HttpCode.OK)
      .json(articles);
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

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articlesService.create(req.body);
    res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articlesService.update(articleId, req.body);

    if (existArticle) {
      res
        .status(HttpCode.OK)
        .send(`Updated`);

    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id:${articleId}`);
    }
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
    const comments = await commentService.findAll(articleId);
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

  route.post(`/:articleId/comments`, [articleExistence(articlesService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    res
      .status(HttpCode.CREATED)
      .json(comment);
  });
};

