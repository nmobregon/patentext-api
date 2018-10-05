const mongoose = require("mongoose");

module.exports.castId = (ents) => {
	if (!ents || !ents.length || !ents[0]._id) return ents;
	ents.forEach((ent)=>{
		ent._id = ent._id.toString();
	});
	return ents;
}

module.exports.ObjectId = ()=> {
	const { ObjectId } = mongoose.Types;
	ObjectId.prototype.valueOf = () => {
		return this.toString();
	};
	return ObjectId;
}

module.exports.now = ()=>{
	const moment = require("moment");
	const CONSTANTS = require("../model/Constants");
	return moment().format(CONSTANTS.DATETIME_FORMAT);
}

module.exports.nowMillis = ()=>{
	const moment = require("moment");
	const CONSTANTS = require("../model/Constants");
	return moment().format(CONSTANTS.DATETIME_FORMAT_WITH_MILLIS);
}