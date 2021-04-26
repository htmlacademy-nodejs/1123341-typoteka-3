'use strict';

const {HttpCode, RegisterMessage} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email} = req.body;
    const foundUser = await service.findByEmail(email);

    if (foundUser) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: [RegisterMessage.USER_ALREADY_REGISTER],
          data: req.body
        });

      return;
    }

    next();
  }
);
