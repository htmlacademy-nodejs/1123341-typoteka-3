'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  // ?????? Мне кажется, не совсем корректный код внутри
  async create(articleId, comment) {
    const postComment = await this._Comment
      .create({
        articleId,
        ...comment
      });

    return postComment;
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    const comments = await this._Comment
      .findAll({
        where: {articleId},
        raw: true
      });

    return comments;
  }
}

module.exports = CommentService;
