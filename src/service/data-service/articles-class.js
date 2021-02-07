'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  find() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  create(article) {
    const newArticle = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...article
    };

    this._articles.push(newArticle);
    return newArticle;
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

  delete(id) {
    const deletedArticle = this._articles.find((item) => item.id === id);

    if (!deletedArticle) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return deletedArticle;
  }
}

module.exports = ArticlesService;

