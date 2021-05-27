'use strict';

const axios = require(`axios`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({offset, limit, comments, userId} = {}) {
    return await this._load(`/articles`, {params: {offset, limit, comments, userId}});
  }

  async getArticle({id, comments} = {}) {
    return await this._load(`/articles/${id}`, {params: {comments}});
  }

  async getArticlesByCategory({id, offset, limit, comments} = {}) {
    return await this._load(`/articles/category/${id}`, {params: {offset, limit, comments}});
  }

  async search(query) {
    return await this._load(`/search`, {params: {query}});
  }

  async getCategories({sumUpEquals} = {}) {
    return await this._load(`/categories`, {params: {sumUpEquals}});
  }

  async deleteArticle({articleId} = {}) {
    return await this._load(`/articles/${articleId}`, {
      method: `DELETE`
    });
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  async updateArticle({articleId, articleData}) {
    return await this._load(`/articles/${articleId}`, {
      method: `PUT`,
      data: articleData
    });
  }

  async createUser(data) {
    return await this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  async createComment(articleId, userId, data) {
    return await this._load(`/articles/${articleId}/comments`, {
      method: `POST`,
      data,
      params: {userId}
    });
  }

  async loginUser(data) {
    return this._load(`/login`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
