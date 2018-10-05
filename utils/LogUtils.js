require('dotenv').config();
const {nowMillis:now} = require("./MongoUtils");

const templates = [{exp:"@@now@@", val:"now()"}, {exp:"@@appname@@", val:"process.env.appname"}];

module.exports.log = (...args)=>{
	const environment = process.env.environment;
	if(environment && environment.toUpperCase() === "DEV"){
		const logPrefix = process.env.log_prefix || "@@now@@";
		console.log(template(logPrefix + " " + args));
	}
}

function template(log=""){

	let templatedLog = log;
	templates.forEach(t=>{
		templatedLog = templatedLog.split(t.exp).join(eval(t.val));
	});
	return templatedLog;

}