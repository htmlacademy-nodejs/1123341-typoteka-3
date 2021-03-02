'use strict';

const dayjs = require(`dayjs`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {DateCypher, MAX_ID_LENGTH, picsNames} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

const FILE_ANNOUNCES = path.resolve(__dirname, `../../../data/announces.txt`);
const FILE_TITLES = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS = path.resolve(__dirname, `../../../data/comments.txt`);
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 6;
const FILE_NAME = `mocks.json`;

const generateDate = () => {
  const milliseconds = getRandomInt(DateCypher.MIN, DateCypher.MAX);
  return new Date(milliseconds);
};

const getPictureFileName = (names) => names[getRandomInt(0, names.length - 1)];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateCategories = (categories) => {
  const words = new Set();
  Array(getRandomInt(1, categories.length)).fill(``)
    .map(() => words.add(categories[getRandomInt(0, categories.length - 1)]));

  return [...words];
};

const generateComments = (count, comments) => (
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments) // перетасовываем массив цитат
        .slice(0, getRandomInt(1, 3)) // подбираем количество цитат
        .join(` `), // соединяем в одну строку
    }))
);

const generateAnnounce = (announces) => {
  const sentences = new Set();
  for (let i = 0; i < getRandomInt(1, 5); i++) {
    sentences.add(announces[getRandomInt(0, announces.length - 1)]);
  }
  const announce = sentences.size !== 0 ? `${[...sentences].join(` `)}` : ``;
  return announce;
};

const generateArticles = (articleShape, articlesCount) => {
  const {
    titles,
    announces,
    categories,
    comments,
  } = articleShape;

  return Array(articlesCount).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    picture: getPictureFileName(picsNames),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(announces),
    fullText: generateAnnounce(announces),
    createdDate: dayjs(generateDate()).format(`YYYY-MM-DD HH:mm:ss`),
    category: generateCategories(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    let articleShape = {};
    const [count] = args;
    articleShape.announces = await readContent(FILE_ANNOUNCES);
    articleShape.titles = await readContent(FILE_TITLES);
    articleShape.categories = await readContent(FILE_CATEGORIES);
    articleShape.comments = await readContent(FILE_COMMENTS);
    let articlesCount = Number.parseInt(count, 10) ? Number.parseInt(count, 10) : DEFAULT_COUNT;

    if (articlesCount >= 1000 || articlesCount < 0) {
      articlesCount = DEFAULT_COUNT;
    }

    const content = JSON.stringify(generateArticles(articleShape, articlesCount));

    try {
      await fs.writeFile(path.resolve(__dirname, `../../../${FILE_NAME}`), content);
      return console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      return console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

