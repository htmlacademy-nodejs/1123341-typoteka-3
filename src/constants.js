'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

const DateCypher = {
  MIN: 1546290000000,
  MAX: 1607179296625
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400
};

const API_PREFIX = `/api`;

const picsNames = [`forest`, `sea`, `skyscraper`, `sea-fullsize`];

const categories = new Map([
  [`Деревья`, `trees`],
  [`За жизнь`, `for-life`],
  [`Без рамки`, `frame-off`],
  [`Разное`, `different`],
  [`IT`, `it`],
  [`Музыка`, `music`],
  [`Кино`, `cinema`],
  [`Программирование`, `coding`],
  [`Железо`, `details`],
]);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`
  },
  {
    email: `kazak@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf98`,
    firstName: `Родион`,
    lastName: `Молотов`,
    avatar: `avatar-2.png`
  },
  {
    email: `westlife@example.com`,
    passwordHash: `5f4dcc3b5aa76d5d61d8327deb882cf99`,
    firstName: `Лось`,
    lastName: `Восточный`,
    avatar: `avatar-3.png`
  },
  {
    email: `cardan@example.com`,
    passwordHash: `5f4dcc3bd5aa765d61d8327deb882cf99`,
    firstName: `Майкл`,
    lastName: `Джонсон`,
    avatar: `avatar-4.png`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb8d82cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-5.png`
  }
];

const Aliase = {
  COMMENTS: `comments`,
  ARTICLES: `articles`,
  CATEGORIES: `categories`,
  ARTICLES_CATEGORIES: `articlesCategories`
};

const ARTICLES_PER_PAGE = 8;

const RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 12 символов`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают`,
  EMPTY_VALUE: `Не указано значение`,
};

const LoginMessage = {
  USER_NOT_EXISTS: `Пользователь с таким email не зарегистрирован`,
  WRONG_PASSWORD: `Неправильно введён пароль`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
};

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 12;

module.exports = {
  DateCypher,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  HttpCode,
  MAX_ID_LENGTH,
  API_PREFIX,
  Env,
  picsNames,
  categories,
  users,
  Aliase,
  ARTICLES_PER_PAGE,
  RegisterMessage,
  LoginMessage,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
};

