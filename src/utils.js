'use strict';

const dayjs = require(`dayjs`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.compareDate = (cardA, cardB) => {
  const dateA = dayjs(cardA.createdDate);
  const dateB = dayjs(cardB.createdDate);
  return dateB.diff(dateA, `minute`);
};

// const generateDate = () => {
//   const milliseconds = getRandomInt(DateCypher.MIN, DateCypher.MAX);
//   return new Date(milliseconds);
// };
