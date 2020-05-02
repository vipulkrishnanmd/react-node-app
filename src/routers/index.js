const messageRouter = require('./message.router')
const userRouter = require('./user.router')

module.exports = function(server) {
    messageRouter.applyRoutes(server);
    userRouter.applyRoutes(server);
}