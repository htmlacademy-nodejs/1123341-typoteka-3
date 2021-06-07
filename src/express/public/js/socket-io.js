'use strict';

const socketIo = io(`http://localhost:8080`);

if (document.querySelector(`.comments__footer`)) {
  const commentsFooter = document.querySelector(`.comments__footer`);

  if (commentsFooter.querySelector(`form`)) {
    const form = commentsFooter.querySelector(`form`);
    const commentText = commentsFooter.querySelector(`textarea[name="user-comment"]`);
  
    form.addEventListener(`submit`, (evt) => {
      const comment = `${commentText.value}`;
  
      if (!socketIo.connected) {
        alert(`Соединение с сервером прервано. Обновите страницу.`);
        return;
      }
  
      socketIo.emit(`user-comment`, comment);
    });
  }
}

if (document.querySelector(`.last__list`) && document.querySelector(`.hot__list`)) {
  socketIo.addEventListener(`send-out-comment`, ({commentText, decodedToken, articleId, popularArticles}) => {
    const commentTemplate = commentMarkup(commentText, decodedToken, articleId);
    const hotListTemplate = hotListMarkup(popularArticles);

    const commentContainer = document.querySelector(`.last__list`);
    renderComponent(commentContainer, createElement(commentTemplate), `afterBegin`);
    commentContainer.removeChild(commentContainer.lastChild);

    const articlesContainer = document.querySelector(`.hot__list`);
    replace(createElement(hotListTemplate), articlesContainer);
  });
}

socketIo.addEventListener(`connect`, () => {
  console.log(`Клиент подключился`);
});

socketIo.addEventListener(`disconnect`, () => {
  console.log(`Клиент в отключке`);
});


function commentMarkup(commentText, decodedToken, articleId) {
  const {userName, userAvatar, userSurname} = decodedToken;
  const text = commentText.length > 100 ? `${commentText.slice(0, 100)}...` : commentText;

  return (
    `<li class="last__list-item">
      <img class="last__list-image" src="img/${userAvatar}" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${userName} ${userSurname}</b>
      <a class="last__list-link" href="/articles/${articleId}">${text}</a>
    </li>`
  );
};

function articlesMarkup(popularArticles) {
  console.log(popularArticles);
  return popularArticles
    .map((article) => {
      const text = article.announce.length > 100 ? `${article.announce.slice(0, 100)}...` : article.announce;

      return (
        `<li class="hot__list-item">
          <a class="hot__list-link" href="/articles/${article.id}">${text}<sup class="hot__link-sup">${article.commentsCount}</sup>
          </a>
        </li>`
      );
    })
    .join(``);
};

function hotListMarkup(popularArticles) {
  return (
    `<ul class="hot__list">
      ${articlesMarkup(popularArticles)}
    </ul>`
  );
}

function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  if (newElement.children.length === 1) {
    return newElement.firstChild;
  } else {
    return 
  };
};

function replace(newElement, oldElement) {
  const parentElement = oldElement.parentElement;
  parentElement.replaceChild(newElement, oldElement);
};

function renderComponent(container, element, place) {
  switch (place) {
    case `afterBegin`:
      container.prepend(element);
      break;
    case `afterEnd`:
      container.after(element);
      break;
    default:
      container.append(element);
  }
};
