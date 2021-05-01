'use strict';

const bcrypt = require(`bcrypt`);

module.exports = async (req, res, next) => {
  console.log(req.session);
  console.log(req.body[`member-csrf`]);
  const {hiddenValue} = req.session;
  const match = await bcrypt.compare(hiddenValue, req.body[`member-csrf`]);

  if (!match) {
    res.redirect(`/login`);

  } else {
    next();
  }
};
