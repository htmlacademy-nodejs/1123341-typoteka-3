-- Полная информация по объявлению
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN articles_categories ON offers.id = articles_categories.offer_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id

-- Пять свежих комментариев
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Все комментарии к объявлению
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 1
  ORDER BY comments.created_at DESC

-- Два объявления о покупке
SELECT * FROM offers
WHERE type = 'OFFER'
  LIMIT 2

-- Обновить заголовок
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1


-- Полная информация по всем объявлениям
SELECT
  offers.title,
  users.first_name,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers
  JOIN articles_categories ON offers.id = articles_categories.offer_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.created_at DESC




-- Получить список всех категорий (идентификатор, наименование категории)
SELECT
  categories.id,
  categories.name
FROM categories
  JOIN articles_categories ON  articles_categories.category_id = categories.id
  GROUP BY categories.id

/*Получить список категорий для которых создана минимум 3 публикации
(идентификатор, наименование категории)*/
SELECT
  categories.id,
  categories.name,
  COUNT(articles_categories.article_id) AS mention_in_articles
FROM categories
  LEFT JOIN articles_categories ON categories.id = articles_categories.category_id
  GROUP BY categories.id
  HAVING COUNT(articles_categories.article_id) > 2

/*Получить список категорий с количеством публикаций
(идентификатор, наименование категории, количество публикаций в категории)*/
SELECT
  categories.id,
  categories.name,
  COUNT(articles_categories.article_id) AS mention_in_articles
FROM categories
  LEFT JOIN articles_categories ON categories.id = articles_categories.category_id
  GROUP BY categories.id


/*Получить список публикаций (идентификатор публикации, заголовок публикации,
анонс публикации, дата публикации, имя и фамилия автора, контактный email,
количество комментариев, наименование категорий). Сначала свежие публикации*/
SELECT
  articles.*,
  users.first_name,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_date DESC


/*Получить полную информацию определённой публикации (идентификатор публикации,
заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению,
имя и фамилия автора, контактный email, количество комментариев, наименование категорий)*/
SELECT
  articles.*,
  users.first_name,
  users.last_name,
  users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 20
  GROUP BY articles.id, users.id

/*Получить список из 5 свежих комментариев (идентификатор комментария,
идентификатор публикации, имя и фамилия автора, текст комментария)*/
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

/*Получить список комментариев для определённой публикации (идентификатор комментария,
идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии*/
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 18
  ORDER BY comments.created_at DESC

/*Обновить заголовок определённой публикации на «Как я встретил Новый год»*/
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 18;
SELECT *
FROM articles
WHERE id = 18