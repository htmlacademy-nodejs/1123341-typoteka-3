'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const articlesRoutes = require(`./articles-routes`);
const ArticlesService = require(`../data-service/articles-service`);
const CommentsService = require(`../data-service/comments-service`);
const {HttpCode} = require(`../../constants`);

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
    "categories": [`Разное`, `Спорт`],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами.`
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, mockArticles, mockCategories);

  const app = express();
  app.use(express.json());

  articlesRoutes(app, new ArticlesService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's title equals "Борьба с прокрастинацией"`, () => expect(response.body[0].title).toBe(`Борьба с прокрастинацией`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как перестать беспокоиться и начать жить"`, () => expect(response.body.title).toBe(`Как перестать беспокоиться и начать жить`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Дам погладить котика`,
    picture: `pig`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    categories: [1, 2],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Дам погладить котика`,
    picture: `cat`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    createdDate: `2020-05-22 11:11:11`,
    category: [`Котики`]
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Дам погладить котика`,
    picture: `wrestling`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    categories: [1, 3]
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/3`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/3`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  const validArticle = {
    title: `Дам погладить котика`,
    picture: `wrestling`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    categories: [1, 3]
  };


  return request(app)
    .put(`/articles/666`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    title: `Дам погладить котика`,
    picture: `family`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    createdDate: `2020-05-22 11:11:11`,
    category: [`Развлечения`]
  };

  return request(app)
    .put(`/articles/2`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment's text is "Давно не пользуюсь стационарными компьютерами."`,
      () => expect(response.body[0].text).toBe(`Давно не пользуюсь стационарными компьютерами.`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/2/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({
      talk: `Шо то там`
    })
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/2/comments/9`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/2/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
