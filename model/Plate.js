const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {model: UserModel} = require("./User");
const {now} = require("../utils/MongoUtils");
const {secure} = require("../utils/ExpressUtils");

const PlateSchema = new Schema({
	number: String,
	owner: String,
	creator: String,
	created: String,
	owned:String
});

const Plate = mongoose.model('plates', PlateSchema);

const findAll = async () => {
	return await Plate.find();
}

const findByNumber = async (data) => {
	return await Plate.findOne({number: data.number});
}

const createPlate = async (data) => {

	const newPlate = 
		{
			number: data.number, 
			creator: data.username,
			created: now()
		};
	return await Plate.create(newPlate);
	
}

const updateOwner = async (data)=>{

	const plate = await findByNumber(data);
	if (!plate) return;
	await Plate.updateOne({number:data.number}, {owner:data.owner, owned: now()});
	return plate;

};

module.exports.updateOwner = updateOwner;
module.exports.mongoSchema = PlateSchema;
module.exports.graphSchema = 
`
type Query {
	plates: [Plate]
	plate(number:String!): Plate
}
type Mutation {
	createPlate(number:String!, username:String!):Plate
}
type Plate {
	number: String!,
	owner: String,
	creator: String,
	created: String,
	owned:String
}`;

module.exports.root = {
    plates: findAll,
	plate: findByNumber,
	createPlate: secure(createPlate),
	updateOwner: secure(updateOwner)
};