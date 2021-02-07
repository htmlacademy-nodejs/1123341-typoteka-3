'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  find(article) {
    return article.comments;
  }

  delete(article, commentId) {
    const dropComment = article.comments
      .find((item) => item.id === commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments
      .filter((item) => item.id !== commentId);

    return dropComment;
  }

  create(article, comment) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...comment
    };

    article.comments.push(newComment);
    return newComment;
  }
}

module.exports = CommentService;
