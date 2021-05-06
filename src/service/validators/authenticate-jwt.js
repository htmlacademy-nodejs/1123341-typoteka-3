'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET} = process.env;

module.exports = (req, res, next) => {
  const authorization = req.cookies[`authorization`];

  try {
    jwt.verify(authorization, JWT_ACCESS_SECRET);
    next();

  } catch (error) {
    res.redirect(`/login`);
  }
};
