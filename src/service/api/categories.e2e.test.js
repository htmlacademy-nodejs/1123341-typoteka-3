'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const categoriesRoutes = require(`./categories-routes`);
const CategoriesService = require(`../data-service/categories-service`);
const {HttpCode, users} = require(`../../constants`);

const mockCategories = [
  `Программирование`,
  `Разное`,
  `Политика`,
  `Спорт`,
  `Музыка`,
];

const mockArticles = [
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.   Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Это один из лучших рок-музыкантов.   Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`,
    "categories": [`Программирование`, `Политика`],
    "comments": [
      {
        "text": `Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "text": `Это где ж такие красоты? Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты?!`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "text": `Плюсую, но слишком много буквы! Совсем немного... Согласен с автором!`
      }
    ]
  },
  {
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция.   Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "categories": [`Разное`],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Это где ж такие красоты?`
      },
      {
        "text": `Это где ж такие красоты? Согласен с автором!`
      },
      {
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Он написал больше 30 хитов.   Как начать действовать? Для начала просто соберитесь.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.   Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.   Простые ежедневные упражнения помогут достичь успеха.   Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "categories": [`Музыка`, `Программирование`],
    "comments": [
      {
        "text": `Хочу такую же футболку :-) Совсем немного...`
      }
    ]
  },
  {
    "title": `Учим HTML и CSS`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "categories": [`Программирование`],
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Это где ж такие красоты?`
      },
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "title": `Рок — это протест`,
    "announce": `Он написал больше 30 хитов.   Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`,
    "fullText": `Это один из лучших рок-музыкантов.`,
    "categories": [`Музыка`, `Разное`],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, mockArticles, mockCategories, users);
  categoriesRoutes(app, new CategoriesService(mockDB));
});

describe(`API returns categories list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 categories`, () => expect(response.body.length).toBe(5));
  test(`Categories names are: "Политика", "Программирование", "Разное", "Музыка", "Спорт"`, () => (
    expect(response.body.map((category) => category.name))
        .toEqual(expect.arrayContaining([`Спорт`, `Политика`, `Программирование`, `Разное`, `Музыка`]))
  ));
});

describe(`API creates a category if data is valid`, () => {
  let response;
  const newCategory = {
    name: `Детское`
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/categories`)
      .send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`New category's name is "Детское"`, () => expect(response.body.name).toBe(`Детское`));
  test(`Categories count are really changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create a category, because it already exist`, () => {
  let response;
  const newCategory = {
    name: `Разное`
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/categories`)
      .send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message: Категория уже существует`,
      () => expect(response.body.message[0]).toBe(`Категория уже существует`));
});

describe(`API refuses to create a category if data is invalid`, () => {
  const newCategoryOne = {name: `Дет`};
  const newCategoryTwo = {name: `Детскоеееееееееееееееееееееееееееееееееееееееееееееееееее`};

  test(`Status code 400`, async () => {
    await request(app)
      .post(`/categories`)
      .send(newCategoryOne)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Status code 400`, async () => {
    await request(app)
      .post(`/categories`)
      .send(newCategoryTwo)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API changes existent category`, () => {
  let response;
  const newCategory = {
    name: `Новые технологии`
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/categories/2`)
      .send(newCategory);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

describe(`API refuses to change existent category, because name already exist`, () => {
  let response;
  const newCategory = {
    name: `Политика`
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/categories/2`)
      .send(newCategory);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message: Категория уже существует`,
      () => expect(response.body.message[0]).toBe(`Категория уже существует`));
});

describe(`API refuses to change a category if data is invalid`, () => {
  const newCategoryOne = {name: `Дет`};
  const newCategoryTwo = {name: `Детскоеееееееееееееееееееееееееееееееееееееееееееееееееее`};

  test(`Status code 400`, async () => {
    await request(app)
      .put(`/categories/3`)
      .send(newCategoryOne)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Status code 400`, async () => {
    await request(app)
      .put(`/categories/3`)
      .send(newCategoryTwo)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API refuses delete a category if some article uses it`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/categories/3`);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message: We can't delete this category yet. We use it now`,
      () => expect(response.text).toBe(`We can't delete this category yet. We use it now`));
});

describe(`API deletes a category`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/categories/4`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

