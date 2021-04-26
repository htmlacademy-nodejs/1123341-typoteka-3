'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
const {secretSession, sequelizeStore} = require(`../service/lib/session-store`);
const path = require(`path`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);
const authRoutes = require(`./routes/auth`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(expressSession({
  store: sequelizeStore,
  secret: secretSession,
  resave: false,
  saveUninitialized: false,
  name: `session_id`
}));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);
app.use(`/`, authRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
