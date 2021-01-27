'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../validators/article-validator`);
const articleExistence = require(`../validators/article-existence`);
const commentValidator = require(`../validators/comment-validator`);


module.exports = (app, articlesService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    res
      .status(HttpCode.OK)
      .json(articles); // ????? посмотреть в консоли res.
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params; // ?????? посмотреть в консоли
    const article = articlesService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id:${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articlesService.create(req.body); // ????? req.body это новый article

    return res
      .status(HttpCode.CREATED) // ???? такого ключа пока нет
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existArticle = articlesService.findOne(articleId);

    if (!existArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id:${articleId}`);
    }

    // ????? в req.body должны быть измененные данные
    const updatedArticle = articlesService.update(articleId, req.body);

    return res
      .status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articlesService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`We couldn't delete article with id:${articleId}, because he didn't exist`);
    }

    return res
      .status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExistence(articlesService), (req, res) => {
    const {article} = res.locals; // ??????
    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExistence(articlesService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExistence(articlesService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};

