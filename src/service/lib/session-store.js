"use strict";

const sequelize = require(`./sequelize`);
const expressSession = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);

const {DB_SECRET_SESSION} = process.env;

const sequelizeStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

module.exports = {
  secretSession: DB_SECRET_SESSION,
  sequelizeStore
};
