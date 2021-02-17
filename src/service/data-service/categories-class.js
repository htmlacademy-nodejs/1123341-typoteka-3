'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  find() {
    const categories = this._articles
      .reduce((acc, article) => {
        article.category.forEach((category) => acc.add(category));
        return acc;
      }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
