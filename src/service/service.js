'use strict';

const {Cli} = require(`./cli`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);


// Все параметры, которые ввёл пользователь, доступны в массиве process.argv.
// В process.argv[0] записан путь к интерпретатору, то есть к Node.js.
// process.argv[1] хранит путь к нашему сценарию.
// А параметры, введённые пользователем начинаются с третьего элемента.
const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));
