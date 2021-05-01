'use strict';

const expressSession = require(`express-session`);
const sequelize = require(`../lib/sequelize`);

const {DB_SECRET_SESSION} = process.env;

module.exports = async (express) => {
  const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);

  const mySessionStore = new SequelizeStore({
    db: sequelize,
    expiration: 180000,
    checkExpirationInterval: 60000,
  });

  express.use(expressSession({
    store: mySessionStore,
    secret: DB_SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    name: `session_id`
  }));

  (async () => {
    await sequelize.sync({force: true});
  })();
};
