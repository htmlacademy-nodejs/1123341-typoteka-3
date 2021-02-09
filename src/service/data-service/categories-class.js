'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  find() {
    const categories = this._articles
      .flatMap((article) => article.category);

    return [...new Set(categories)];
  }
}

module.exports = CategoryService;
