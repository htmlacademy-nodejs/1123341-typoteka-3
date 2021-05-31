'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET} = process.env;

module.exports = (req, _res, next) => {
  const token = req.cookies[`authorization`];
  let userData = null;

  try {
    const decodedToken = jwt.verify(token, JWT_ACCESS_SECRET);
    userData = token ? decodedToken : {isLogged: false};

  } catch (err) {
    userData = {isLogged: false};
  }

  req.userData = userData;
  next();
};
