/**
 * Module Dependencies
 */
const Router = require("restify-router").Router;
const routerInstance = new Router();

/**
 * Module Controllers
 */
const UserController = require("../controllers/UserController");

routerInstance.post("/user/signup", UserController.create);
routerInstance.get("/user/:username", UserController.findByUsername);
routerInstance.post("/user/login", UserController.login);

module.exports = routerInstance;
