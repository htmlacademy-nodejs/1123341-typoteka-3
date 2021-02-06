'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

// маршрут оборачиваем в функцию
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query; // ?????? query
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]); // ???? как это будет выглядеть
      return;
    }

    const searchResults = service.find(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
