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

// describe(`API returns a list of all articles`, () => {
//   const app = createAPI();
//   let response;

//   beforeAll(async () => {
//     response = await request(app)
//       .get(`/articles`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//   test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
//   test(`First article's id equals "QlwMTH"`, () => expect(response.body[0].id).toBe(`QlwMTH`));
// });

// describe(`API returns an article with given id`, () => {
//   const app = createAPI();
//   let response;

//   beforeAll(async () => {
//     response = await request(app)
//       .get(`/articles/hvRfDJ`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//   test(`Article's title is "Как перестать беспокоиться и начать жить"`, () => expect(response.body.title).toBe(`Как перестать беспокоиться и начать жить`));
// });

// describe(`API creates an article if data is valid`, () => {
//   const newArticle = {
//     title: `Дам погладить котика`,
//     announce: `Иногда котики умываются после глажки`,
//     fullText: `Это мой кот. Зовут Винки!`,
//     createdDate: `2020-05-22 11:11:11`,
//     category: [`Котики`],
//   };

//   const app = createAPI();
//   let response;

//   beforeAll(async () => {
//     response = await request(app)
//       .post(`/articles`)
//       .send(newArticle);
//   });

//   console.log(response);

//   test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
//   test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
//   test(`Articles count is changed`, () => request(app)
//     .get(`/articles`)
//     .expect((res) => expect(res.body.length).toBe(6))
//   );
// });
