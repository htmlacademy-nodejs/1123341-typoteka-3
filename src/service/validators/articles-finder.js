'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const articles = await service.findArticlesByCategory(categoryId);

  if (articles.length !== 0) {
    res
      .status(HttpCode.BAD_REQUEST)
      .send(`We can't delete this category yet. We use it now`);

  } else {
    next();
  }
};
