'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const DateCypher = {
  MIN: 1546290000000,
  MAX: 1607179296625
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports = {
  DateCypher,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
};

