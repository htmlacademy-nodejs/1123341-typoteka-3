'use strict';

const express = require(`express`);
const cookieParser = require(`cookie-parser`);
const cookie = require(`cookie`);
const path = require(`path`);
const http = require(`http`);
const jwt = require(`jsonwebtoken`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);
const authRoutes = require(`./routes/auth`);
const api = require(`./api`).getAPI();
const {refreshTokenService} = require(`../service/api`);

const {DB_SECRET_SESSION, JWT_ACCESS_SECRET} = process.env;
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
const server = http.createServer(app);
const socketIo = require(`socket.io`)(server);

app.use(cookieParser(DB_SECRET_SESSION));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);
authRoutes(app, refreshTokenService);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

socketIo.on(`connection`, (socket) => {
  const {address: ip} = socket.handshake;
  console.log(`Новое подключение: ${ip}`);

  socket.on(`user-comment`, async (commentText) => {
    let allArticles = await api.getArticles({comments: true});
    const articleId = socket.handshake.headers.referer.slice(31);
    allArticles = allArticles.map((item) => ({...item, comments: item.comments.length}));
    const index = allArticles.findIndex((item) => item.id === Number(articleId));
    allArticles[index].comments += 1;
    const popularArticles = allArticles
      .sort((articleA, articleB) => articleB.comments - articleA.comments)
      .slice(0, 4);


    const cookies = cookie.parse(socket.request.headers.cookie || ``);
    const decodedToken = jwt.verify(cookies.authorization, JWT_ACCESS_SECRET);
    socket.broadcast.emit(`send-out-comment`, {commentText, decodedToken, articleId, popularArticles});
  });
});

server.listen(DEFAULT_PORT);
