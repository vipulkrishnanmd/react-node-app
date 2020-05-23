/**
 * Module Dependencies
 */
const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')
const restifyPlugins = require('restify-plugins')
const rjwt = require('restify-jwt-community')


/**
  * Initialize Server
 */
const server = restify.createServer({
	name: config.name,
	version: config.version,
	ignoreTrailingSlash: true
})


/**
  * Middleware
 */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }))
server.use(restifyPlugins.acceptParser(server.acceptable))
server.use(restifyPlugins.queryParser({ mapParams: true }))
server.use(restifyPlugins.fullResponse())

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['*']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.use(rjwt(config.jwt).unless({
    path: ['api/user/signup', 'api/user/login']
}));


/**
  * Start Server, Connect to DB & Require Routes
*/
server.listen(config.port, () => {
	// establish connection to mongodb
	/**
	var connectWithRetry = function() {
		return mongoose.connect(config.db.uri, { useNewUrlParser: true }, function(err) {
		  if (err) {
			console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
			setTimeout(connectWithRetry, 5000);
		  }
		});
	  };
	connectWithRetry();
	*/
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri, { useNewUrlParser: true })

	const db = mongoose.connection

	db.on('error', (err) => {
	    console.error(err)
	    process.exit(1)
	});

	db.once('open', () => {
	    require('./src/routers')(server)
	    console.log(`Server is listening on port ${config.port}`)
	});
});