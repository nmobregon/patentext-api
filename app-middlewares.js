require('dotenv').config();
const jwt = require('express-jwt')
const log = require("./utils/LogUtils").log;

module.exports.auth = jwt({
	secret: process.env.JWT_SECRET,
	credentialsRequired: false
})

module.exports.requestLogger = (req,res,next)=>{
	const {query, variables, fields} = req.body;
	log(`Query: ${query}`);
	log(`Variables: ${JSON.stringify(variables)}`);
	log(`Fields: ${JSON.stringify(fields)}`);
	next();
}