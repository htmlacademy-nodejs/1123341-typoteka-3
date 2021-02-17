'use strict';

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./articles-controller`);
const DataService = require(`../data-service/articles-class`);
const CommentService = require(`../data-service/comments-class`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `QlwMTH`,
    "picture": `forest`,
    "title": `Борьба с прокрастинацией`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`,
    "createdDate": `2019-09-03 12:00:44`,
    "category": [`Программирование`, `Деревья`],
    "comments": [
      {
        "id": `9vFKzV`,
        "text": `Согласен с автором! Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `jpZoY1`,
        "text": `Это где ж такие красоты? Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "id": `UFsBaF`,
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Плюсую, но слишком много буквы!`
      },
      {
        "id": `Pu11gw`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      },
      {
        "id": `KZUcka`,
        "text": `Плюсую, но слишком много буквы! Совсем немного... Согласен с автором!`
      }
    ]
  },
  {
    "id": `hvRfDJ`,
    "picture": `skyscraper`,
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "createdDate": `2019-01-18 14:13:57`,
    "category": [`Разное`],
    "comments": [
      {
        "id": `jGgpP3`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Это где ж такие красоты?`
      },
      {
        "id": `Vypz-H`,
        "text": `Это где ж такие красоты? Согласен с автором!`
      },
      {"id": `Ja3ATc`, "text": `Планируете записать видосик на эту тему?`},
      {
        "id": `_7digt`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `Yo8wNn`,
    "picture": `sea`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "createdDate": `2019-01-08 20:15:29`,
    "category": [`Музыка`, `Программирование`],
    "comments": [
      {
        "id": `mpAjH3`,
        "text": `Хочу такую же футболку :-) Совсем немного...`
      }
    ]
  },
  {
    "id": `p8U4f6`,
    "picture": `sea-fullsize`,
    "title": `Рок — это протест`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "createdDate": `2019-01-16 05:57:53`,
    "category": [`Программирование`],
    "comments": [
      {
        "id": `MKlhKa`,
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {"id": `vOER6-`, "text": `Это где ж такие красоты?`},
      {"id": `jaYvN-`, "text": `Согласен с автором!`},
      {
        "id": `PaMjs5`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "id": `frgO_n`,
    "picture": `sea`,
    "title": `Рок — это протест`,
    "announce": `Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`,
    "fullText": `Это один из лучших рок-музыкантов.`,
    "createdDate": `2020-10-06 18:57:38`,
    "category": [
      `Музыка`,
      `Разное`
    ],
    "comments": [
      {
        "id": `MLZPQ0`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals "QlwMTH"`, () => expect(response.body[0].id).toBe(`QlwMTH`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/hvRfDJ`);
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
    createdDate: `2020-05-22 11:11:11`,
    category: [`Котики`],
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
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

  const app = createAPI();

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
    createdDate: `2020-05-22 11:11:11`,
    category: [`Котики`]
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/frgO_n`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/frgO_n`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();
  const validArticle = {
    title: `Дам погладить котика`,
    picture: `family`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    createdDate: `2020-05-22 11:11:11`,
    category: [`Котики`]
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();
  const invalidArticle = {
    title: `Дам погладить котика`,
    picture: `family`,
    announce: `Иногда котики умываются после глажки`,
    fullText: `Это мой кот. Зовут Винки!`,
    createdDate: `2020-05-22 11:11:11`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/frgO_n`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`frgO_n`));
  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/p8U4f6/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment's id is "MKlhKa"`, () => expect(response.body[0].id).toBe(`MKlhKa`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/p8U4f6/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/p8U4f6/comments`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/p8U4f6/comments`)
    .send({
      talk: `Шо то там`
    })
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/p8U4f6/comments/vOER6-`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`vOER6-`));
  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/p8U4f6/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/p8U4f6/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
