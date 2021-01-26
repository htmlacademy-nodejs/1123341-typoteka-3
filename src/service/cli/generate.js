'use strict';

const dayjs = require(`dayjs`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt} = require(`../../utils`);
const {DateCypher, MAX_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

const FILE_ANNOUNCES = `../../data/announces.txt`;
const FILE_TITLES = `../../data/titles.txt`;
const FILE_CATEGORIES = `../../data/categories.txt`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const generateDate = () => {
  const milliseconds = getRandomInt(DateCypher.MIN, DateCypher.MAX);
  return new Date(milliseconds);
};

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


const generateAnnounce = (announces) => {
  const sentences = new Set();
  for (let i = 0; i < getRandomInt(1, 5); i++) {
    sentences.add(announces[getRandomInt(0, announces.length - 1)]);
  }
  const announce = sentences.size !== 0 ? `${[...sentences].join(` `)}` : ``;
  return announce;
};

const generateOffers = (count, announces, titles, categories) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(announces),
    fullText: generateAnnounce(announces),
    createdDate: dayjs(generateDate()).format(`YYYY-MM-DD HH:mm:ss`),
    category: generateCategories(categories),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const announces = await readContent(FILE_ANNOUNCES);
    const titles = await readContent(FILE_TITLES);
    const categories = await readContent(FILE_CATEGORIES);
    let countOffer = DEFAULT_COUNT;

    if (Number.parseInt(count, 10) && Number.parseInt(count, 10) <= 1000) {
      countOffer = Number.parseInt(count, 10);
    }

    const content = JSON.stringify(generateOffers(countOffer, announces, titles, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      return console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      return console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

