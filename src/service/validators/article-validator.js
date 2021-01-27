'use strict';

const {HttpCode} = require(`../../constants`);
const articleKeys = [`announce`, `fullText`, `createdDate`, `title`, `category`, `comments`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);

  const keysExists = articleKeys.every((key) => keys.includes(key)); // ????? БЕЗ "id"

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST) // ????? такого ключа не существует
      .send(`Bad request`);
  }

  next();
};
