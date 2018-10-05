const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {mongoSchema: UserSchema, model: UserModel} = require("./User");
const {castId, ObjectId, now} = require("../utils/MongoUtils");
const {secure} = require("../utils/ExpressUtils");

const MessageSchema = new Schema({
	_id:Object,
	text:String,
	user:UserSchema,
	plate:String,
	location:[Number],
	messageTypeId:String,
	created:String,
	response:String,
	responded:String
});

const Message = mongoose.model('messages', MessageSchema);

const findAll = async () => {
	return castId(await Message.find());
}

const findById = async (data) => {
	return castId( await Message.findById(new ObjectId(data.id)));
}

const findByPlate = async (data) => {
	return castId(await  Message.find({plate: data.plate}));
}

const sendMessage = async (data) => {
	const msg = {
		text: data.text,
		user: castId(await  UserModel.findOne({username: data.username})),
		plate: data.plate,
		registered: now()
	};
	return castId(await Message.create(msg));
}

const respond = async (data) => {
	await Message.updateOne({_id:data.messageId}, 
		{
			response: data.text, 		
			responded: now()
		}
	);
	return castId(await findById(new ObjectId(data.messageId)));
	
}

module.exports.mongoSchema = MessageSchema;
module.exports.graphSchema = 
`
type Query {
	messages: [Message],
	plateMessages(plate: String!): [Message],
	message(id:String!): Message
}
type Mutation {
	sendMessage(plate:String!, 
				username:String!, 
				text:[String]!,
				messageTypeId:String!,
				location:[Float]):Message,
	respond(messageId:String, text:String): Message
}
type Message {
	_id:String,
	text:String!,
	plate:String!,
	user: User!,
	messageTypeId:String!,
	location: [Float],
	created:String,
	response:String,
	responded:String
}`;

module.exports.root = {
	messages: secure(findAll),
	message: secure(findById),
	plateMessages: findByPlate,
	sendMessage: secure(sendMessage),
	respond: secure(respond)
};