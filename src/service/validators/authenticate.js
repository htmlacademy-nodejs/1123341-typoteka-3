'use strict';

const {HttpCode, LoginMessage} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email, password} = req.body;
    const existsUser = await service.findByEmail(email);

    if (!existsUser) {
      res
        .status(HttpCode.NOT_FOUND)
        .json({
          message: [LoginMessage.USER_NOT_EXISTS],
          data: req.body
        });

      return;
    }

    if (!await service.checkUser(existsUser, password)) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: [LoginMessage.WRONG_PASSWORD],
          data: req.body
        });

      return;
    }

    next();
  }
);
