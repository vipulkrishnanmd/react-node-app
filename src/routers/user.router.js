/**
 * Module Dependencies
 */
const Router = require("restify-router").Router;
const routerInstance = new Router();

/**
 * Module Controllers
 */
const UserController = require("../controllers/UserController");

routerInstance.post("/api/user/signup", UserController.create);
routerInstance.get("/api/user/:username", UserController.findByUsername);
routerInstance.post("/api/user/login", UserController.login);

module.exports = routerInstance;
