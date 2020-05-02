/**
 * Module Dependencies
 */
const Router = require("restify-router").Router;
const routerInstance = new Router();

/**
 * Module Controllers
 */
const MessageController = require("../controllers/MessageController");

routerInstance.get("/message", MessageController.findAll);
routerInstance.get("/message/:id", MessageController.findById);
routerInstance.post("/message", MessageController.create);
routerInstance.del("/message/:id", MessageController.delete);
routerInstance.put("/message/:id", MessageController.update);

module.exports = routerInstance;
