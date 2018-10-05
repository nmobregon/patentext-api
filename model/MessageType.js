const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {secure} = require("../utils/ExpressUtils");

const MessageTypeSchema = new Schema({
	template: String,
	category: String
});

const MessageType = mongoose.model('message_types', MessageTypeSchema);

const findAll = async () => {
	return await MessageType.find();
}

const findByCategory = async (data) => {
	return await MessageType.find({category: data.category});
}

const createType = async (data) => {

	const newMT = 
		{
			template: data.template, 
			category: data.category
		};
	return await MessageType.create(newMT);
	
}

module.exports.mongoSchema = MessageTypeSchema;
module.exports.graphSchema = 
`
type Query {
	messageTypes: [MessageType]
	messageTypesByCategory(category:String!): [MessageType]
}
type Mutation {
	createType(template:String!, category:String!):MessageType
}
type MessageType {
	template: String,
	category: String
}`;

module.exports.root = {
    messageTypes: secure(findAll),
	messageTypesByCategory: secure(findByCategory),
	createType: secure(createType)
};