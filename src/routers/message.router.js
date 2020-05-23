/**
 * Module Dependencies
 */
const Router = require("restify-router").Router;
const routerInstance = new Router();

/**
 * Module Controllers
 */
const MessageController = require("../controllers/MessageController");

routerInstance.get("/api/message", MessageController.findAll);
routerInstance.get("/api/message/:id", MessageController.findById);
routerInstance.post("/api/message", MessageController.create);
routerInstance.del("/api/message/:id", MessageController.delete);
routerInstance.put("/api/message/:id", MessageController.update);

module.exports = routerInstance;
