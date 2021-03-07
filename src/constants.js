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
  users
};

