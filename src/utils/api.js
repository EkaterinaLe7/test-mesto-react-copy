class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _getResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponse);
  }

  createCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponse);
  }

  setUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  likeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._getResponse);
  }

  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponse);
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this.likeCard(id);
    }
    return this.deleteLike(id);
  }

  editAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  deliteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-66",
  headers: {
    authorization: "e1c180e3-79bc-4925-aea2-ad0bf0c788ad",
    "Content-Type": "application/json",
  },
});

export default api;
