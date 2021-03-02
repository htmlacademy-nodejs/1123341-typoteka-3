'use strict';

const chalk = require(`chalk`);
const path = require(`path`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {picsNames, users} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const FILE_ANNOUNCES = path.resolve(__dirname, `../../../data/announces.txt`);
const FILE_TITLES = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS = path.resolve(__dirname, `../../../data/comments.txt`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\r`).join().split(`,\n`);

  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateCategories = (categories) => {
  const categoriesNumber = new Set();
  Array(getRandomInt(1, categories.length))
    .fill(``)
    .map(() => categoriesNumber.add(getRandomInt(1, categories.length)));

  return [...categoriesNumber];
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count)
    .fill({})
    .map(() => ({
      userId: getRandomInt(1, userCount),
      articleId,
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }))
);

const getPictureFileName = (names) => names[getRandomInt(0, names.length - 1)];

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

  return Array(articlesCount).fill({}).map((_, index) => ({
    category: generateCategories(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, users.length, comments),
    picture: getPictureFileName(picsNames),
    announce: generateAnnounce(announces),
    fullText: generateAnnounce(announces),
    title: titles[getRandomInt(0, titles.length - 1)],
    userId: getRandomInt(1, users.length)
  }));
};

module.exports = {
  name: `--fill`,
  async run(args) {
    let articleShape = {};
    const [count] = args;
    articleShape.announces = await readContent(FILE_ANNOUNCES);
    articleShape.titles = await readContent(FILE_TITLES);
    articleShape.categories = await readContent(FILE_CATEGORIES);
    console.log(articleShape.categories);
    articleShape.comments = await readContent(FILE_COMMENTS);
    let articlesCount = Number.parseInt(count, 10) ? Number.parseInt(count, 10) : DEFAULT_COUNT;

    if (articlesCount >= 1000 || articlesCount < 0) {
      articlesCount = DEFAULT_COUNT;
    }

    const articles = generateArticles(articleShape, articlesCount);
    const comments = articles.flatMap((article) => article.comments);
    const articlesCategories = articles.flatMap((article, index) => (
      article.category.map((item) => ({articleId: index + 1, categoryId: item}))
    ));

    const userValues = users
      .map(({email, passwordHash, firstName, lastName, avatar}) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`)
      .join(`,\n`);

    const categoryValues = articleShape.categories
      .map((name) => `('${name}')`)
      .join(`,\n`);

    const articleValues = articles
      .map(({title, announce, fullText, picture, userId}) =>
        `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
      )
      .join(`,\n`);

    const articleCategorieValues = articlesCategories
      .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`)
      .join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategorieValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(path.resolve(__dirname, `../../../${FILE_NAME}`), content);
      console.log(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
