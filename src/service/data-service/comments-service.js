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
    const deletedComments = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedComments;
  }

  async findAll({articleId, userId}) {
    let comments = null;

    if (articleId) {
      comments = await this._Comment.findAll({where: {articleId}, raw: true});
    } else if (userId) {
      comments = await this._Comment.findAll({where: {userId}, raw: true});
    } else {
      comments = await this._Comment.findAll();
      return comments.map((item) => item.get());
    }

    return comments;
  }
}

module.exports = CommentService;
