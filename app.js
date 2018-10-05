require('dotenv').config();
const {app} = require("./app-express");
const {log} = require("./utils/LogUtils");

//Server start
const PORT = process.env.port || 3000;
app.listen(PORT, function () {
	require("./app-mongoose");
	log(`Listening on port ${PORT}!`);
});