const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser')
const helmet = require('helmet');
const cors = require("cors");

const {auth, requestLogger} = require("./app-middlewares");
const {mergedSchema, schema, root} = require("./app-graphql");

const app = express();

//Express conf
app.use('/graphql', 
		helmet(), 
		bodyParser.json(), 
		auth, 
		requestLogger, 
		cors(),
		graphqlHTTP(req=>({
			schema: schema,
			rootValue: root,
			graphiql: true,
			context: {
				user: req.user
			}
		}))
);

app.get('/schema', function(req, res) {
	res.send(mergedSchema);
});

module.exports.app = app;