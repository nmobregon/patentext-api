const {mergeTypes} = require('merge-graphql-schemas');
const {buildSchema} = require('graphql');

const User = require("./model/User");
const Message = require("./model/Message");
const MessageType = require("./model/MessageType");
const Plate = require("./model/Plate");

// Begin GraphQL schema
const mergedSchema = mergeTypes([
	User.graphSchema,
	MessageType.graphSchema,
	Message.graphSchema,
	Plate.graphSchema
], {
	all: true
});
const schema = buildSchema(mergedSchema);

const root = {
	...User.root,
	...Message.root,
	...MessageType.root,
	...Plate.root
};
// End GraphQL schema

module.exports.mergedSchema = mergedSchema;
module.exports.schema = schema;
module.exports.root = root;