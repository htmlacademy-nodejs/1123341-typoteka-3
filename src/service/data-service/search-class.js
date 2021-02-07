'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  find(searchText) {
    return this._articles.
      filter((article) => article.title.includes(searchText));
  }

}

module.exports = SearchService;
