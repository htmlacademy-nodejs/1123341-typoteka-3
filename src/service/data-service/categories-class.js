'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  find() {
    const categories = this._offers
      .flatMap((offer) => offer.category);

    return new Set(categories);
  }
}

module.exports = CategoryService;
