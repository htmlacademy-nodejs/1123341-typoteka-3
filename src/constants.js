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
  categories
};

