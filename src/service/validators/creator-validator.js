'use strict';

module.exports = (api) => async (req, res, next) => {
  const {id} = req.params;
  const {userData} = req;
  const {article} = await api.getArticle({id});

  if (article.userId !== userData.id) {
    res.redirect(`/login`);
  }

  next();
};
