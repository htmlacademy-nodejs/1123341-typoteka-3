'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const {picsNames} = require(`../../constants`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const FILE_ANNOUNCES = path.resolve(__dirname, `../../../data/announces.txt`);
const FILE_TITLES = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS = path.resolve(__dirname, `../../../data/comments.txt`);
const DEFAULT_COUNT = 10;
const MAX_COMMENTS = 6;

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    logger.error(chalk.red(`Error when reading file: ${err.message}`));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }))
);

const generateCategories = (categories) => {
  const words = new Set();
  Array(getRandomInt(1, categories.length))
    .fill(``)
    .map(() => words.add(categories[getRandomInt(0, categories.length - 1)]));

  return [...words];
};

const getPictureFileName = (names) => names[getRandomInt(0, names.length - 1)];

const generateAnnounce = (announces) => {
  const sentences = new Set();
  for (let i = 0; i < getRandomInt(1, 5); i++) {
    sentences.add(announces[getRandomInt(0, announces.length - 1)]);
  }
  const announce = sentences.size !== 0 ? `${[...sentences].join(` `)}` : ``;
  return announce;
};

const generateArticles = (fullMockData, articlesCount) => {
  const {
    titles,
    announces,
    categories,
    comments,
  } = fullMockData;

  return Array(articlesCount).fill({}).map(() => ({
    picture: getPictureFileName(picsNames),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(announces),
    fullText: generateAnnounce(announces),
    categories: generateCategories(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }));
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    let fullMockData = {};
    const [count] = args;

    fullMockData.announces = await readContent(FILE_ANNOUNCES);
    fullMockData.titles = await readContent(FILE_TITLES);
    fullMockData.categories = await readContent(FILE_CATEGORIES);
    fullMockData.comments = await readContent(FILE_COMMENTS);
    let articlesCount = Number.parseInt(count, 10) ? Number.parseInt(count, 10) : DEFAULT_COUNT;

    if (articlesCount >= 1000 || articlesCount < 0) {
      articlesCount = DEFAULT_COUNT;
    }

    const articles = generateArticles(fullMockData, articlesCount);

    return initDatabase(sequelize, articles, fullMockData);
  }
};
