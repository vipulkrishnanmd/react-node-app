import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://server:3000";

const encode = encodeURIComponent;
const responseBody = (res) => res.body;

let token = null;
let username = null;
const tokenPlugin = (req) => {
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
    req.set("username", `${username}`);
  }
};

const requests = {
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
};

const Auth = {
  current: () => requests.get("/user/" + username),
  login: (username, password) =>
    requests.post("/user/login", { user: { username, password } }),
  register: (username, email, password) =>
    requests.post("/user/signup", { username, email, password }),
  save: (user) => requests.put("/user", { user }),
};

const Message = {
  send: (email, message) => requests.post("/message", {message: {email, message}})
}

export default {
  Auth,
  Message,
  setToken: (_token) => {
    token = _token;
  },
  setUsername: (_username) => {
    username = _username;
  },
};
