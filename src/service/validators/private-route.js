'use strict';

module.exports = (req, res, next) => {
  const {isLogged} = req.session;

  if (!isLogged) {
    res.redirect(`/login`);

  } else {
    next();
  }
};

