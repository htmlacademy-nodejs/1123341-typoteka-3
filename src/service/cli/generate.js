'use strict';

const dayjs = require(`dayjs`);
const fs = require(`fs`);
const {getRandomInt} = require(`../../utils`);
const {DateCypher, titles, announces, categories} = require(`../../constants`);
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const generateDate = () => {
  const milliseconds = getRandomInt(DateCypher.MIN, DateCypher.MAX);
  return new Date(milliseconds);
};

const generateCategories = () => {
  const words = new Set();
  Array(getRandomInt(1, categories.length)).fill(``)
    .map(() => words.add(categories[getRandomInt(0, categories.length - 1)]));

  return [...words];
};


const generateAnnounce = () => {
  const sentences = new Set();
  for (let i = 0; i < getRandomInt(1, 5); i++) {
    sentences.add(announces[getRandomInt(0, announces.length - 1)]);
  }
  const announce = sentences.size !== 0 ? `${[...sentences].join(` `)}` : ``;
  return announce;
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(),
    fullText: generateAnnounce(),
    createdDate: dayjs(generateDate()).format(`YYYY-MM-DD HH:mm:ss`),
    category: generateCategories(),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args; // получение первого элемента массива

    let countOffer = ``;
    if (Number.parseInt(count, 10) && Number.parseInt(count, 10) <= 1000) {
      countOffer = Number.parseInt(count, 10);

    } else if (!Number.parseInt(count, 10)) {
      countOffer = DEFAULT_COUNT;

    } else {
      countOffer = null;
    }

    const content = countOffer ? JSON.stringify(generateOffers(countOffer)) : `false`; // преобразуем в строку JSON

    // FILE_NAME - имя файла
    // content - данные, которые требуется записать в файл
    // колбэк-функция
    fs.writeFile(FILE_NAME, content, (err) => {
      if (content === `false`) {
        return console.error(`Не больше 1000 публикаций`);
      }

      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};

