const fetch = require("node-fetch");
const constants = require("../constants");

const Profile = require("../factories/profile");
const Person = require("../factories/person");

const TINDER_URL = constants.TINDER_URL;
const LIMIT = constants.LIMIT;

let instance;

class tinderAPI {
  constructor(token) {
    if (instance) return instance;

    this.setToken;

    instance = this;
  }

  setToken(token) {
    this._token = token;
  }

  async profile() {
    try {
      const data = await this.getRequest("/v2/profile?include=account%2Cuser");
      return new Profile(data.data, this);
    } catch (ex) {
      throw ex;
    }
  }

  async matches(limit = LIMIT.MATCH) {
    try {
      const data = await this.getRequest(`/v2/matches?count=${limit}`);
      return data.data.matches.map(el => new Person(el.person, this));
    } catch (ex) {
      throw ex;
    }
  }

  async like(id) {
    try {
      try {
        const data = await this.getRequest(`/like/${id}`);
        return {
          is_match: data.match,
          liked_remaining: data.likes_remaining
        };
      } catch (ex) {
        throw ex;
      }
    } catch (ex) {
      throw ex;
    }
  }

  async dislike(id) {
    try {
      try {
        const data = await this.getRequest(`/pass/${id}`);
        return true;
      } catch (ex) {
        throw ex;
      }
    } catch (ex) {
      throw ex;
    }
  }

  async nearby_persons() {
    try {
      try {
        const data = await this.getRequest("/v2/recs/core");
        return data.data.results.map(el => new Person(el.user));
      } catch (ex) {
        throw ex;
      }
    } catch (ex) {
      throw ex;
    }
  }

  getRequest(url) {
    return new Promise((res, rej) => {
      fetch(`${TINDER_URL}/${url}`, {
        method: "get",
        // body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this._token
        }
      })
        .then(response => response.json())
        .then(json => res(json))
        .catch(ex => rej(ex));
    });
  }
}

module.exports = new tinderAPI();
/*
    def matches(self, limit=10):
        data = requests.get(TINDER_URL + f"/v2/matches?count={limit}", headers={"X-Auth-Token": self._token}).json()
        return list(map(lambda match: Person(match["person"], self), data["data"]["matches"]))

    def like(self, user_id):
        data = requests.get(TINDER_URL + f"/like/{user_id}", headers={"X-Auth-Token": self._token}).json()
        return {
            "is_match": data["match"],
            "liked_remaining": data["likes_remaining"]
        }

    def dislike(self, user_id):
        requests.get(TINDER_URL + f"/pass/{user_id}", headers={"X-Auth-Token": self._token}).json()
        return True

    def nearby_persons(self):
        data = requests.get(TINDER_URL + "/v2/recs/core", headers={"X-Auth-Token": self._token}).json()
        return list(map(lambda user: Person(user["user"], self), data["data"]["results"]))
      */
