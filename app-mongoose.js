const mongoose = require('mongoose');
const log = require("./utils/LogUtils").log;

// Begin Mongoose conf
mongoose.connect("mongodb://localhost/patentext", {
	useNewUrlParser: true
});
mongoose.connection.once("open", (e) => {
	if(e) return log(e);
	log("Connected to Mongoose Database");
})
//End mongoose conf