'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, userId, comment) {
    let postComment = await this._Comment.create({
      articleId,
      userId,
      ...comment
    });

    return postComment.get();
  }

  async drop(id) {
    const changedComments = await this._Comment.destroy({
      where: {id}
    });

    return !!changedComments;
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
