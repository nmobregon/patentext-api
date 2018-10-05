const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {castId,now} = require("../utils/MongoUtils");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const {updateOwner: updatePlateOwner} = require("./Plate");
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config();
const {secure} = require("../utils/ExpressUtils");

const UserSchema = new Schema({
	_id:Object,
	fullName: String,
	username: String,
	password: String,
	subscriptions: [String],
	registered: String
});

const User = mongoose.model('users', UserSchema);


const findAll = async ({user}) => {
	
	return castId(await User.find());
}

const findByUsername = async (data) => {
	
	return castId(await User.findOne({
		username: data.username
	}));
}

const countByPlate = async (data) => {
	return await User.countDocuments({
		subscriptions: data.plate
	});
}

const login = async (data) => {

	const user = castId(await User.findOne({username:data.username}));
	if (user) {
		const valid = bcrypt.compareSync(data.password, user.password);
		if (valid) {
			// return json web token
			return jsonwebtoken.sign({
					id: user._id,
					username: user.username
				},
				process.env.JWT_SECRET, {
					expiresIn: '1d'
				}
			)
		}

	}
	throw new Error('Incorrect user or password')
}

const registerUser = async (data) => {

	if (await User.countDocuments({
			username: data.username
		})) return null;

	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(data.password, salt);

	const newUser = {
		fullName: data.fullName,
		username: data.username,
		password: hash,
		subscriptions: data.subscriptions,
		registered: now(),

	};
	return await User.create(newUser);
};

const subscribePlate = async (data) => {
	

	const subscriber = await findByUsername(data);

	if (!subscriber) return;

	const subs = subscriber.subscriptions || [];
	subs.push(data.plate);

	await User.updateOne({
		username: data.username
	}, {
		subscriptions: subs
	});
	return castId(await findByUsername(data));
}

const ownPlate = async (data) => {
	

	const owner = await User.findOne({
		username: data.owner
	});
	owner.subscriptions = owner.subscriptions || [];
	const indexOwner = owner.subscriptions.findIndex(s => s === data.plate);
	if (indexOwner < 0) {
		owner.subscriptions.push(data.plate);
		await User.updateOne({
			username: data.owner
		}, {
			subscriptions: owner.subscriptions
		});
	}

	const users = await User.find({
		subscriptions: data.plate
	});

	return Promise.all(users.map(u => {
		if (u.username !== data.owner) {
			u.subscriptions = u.subscriptions || [];
			const index = u.subscriptions.findIndex(s => s === data.plate);
			u.subscriptions.splice(index, 1);
			return User.updateOne({
				username: u.username
			}, {
				subscriptions: u.subscriptions
			});
		}
	})).then(async (cls) => {
		await updatePlateOwner({
			number: data.plate,
			owner: data.owner
		});
		return "OK";
	}).catch(e => e.toString());

}

const me = async (data, user) => {
	return await User.findOne({username:user.username});
}

module.exports.model = User;
module.exports.mongoSchema = UserSchema;
module.exports.graphSchema =
	`
type Query {
	me:User
	user(username: String!): User
	users: [User]
	plateSubscribers(plate:String!): Int
}
type Mutation {
	registerUser(fullName:String!, username:String!, password:String!, subscriptions:[String]):User,
	subscribePlate(username:String!, plate:String!):User,
	ownPlate(owner:String!, plate:String!):String,
	login(username:String!, password:String!): String
}
type User {
	id:String
	fullName: String
	username: String
	subscriptions: [String]
	registered:String
}
`;

module.exports.root = {
	me: secure(me),
	user: secure(findByUsername),
	users: secure(findAll),
	plateSubscribers: countByPlate,
	registerUser: registerUser,
	login: login,
	subscribePlate: secure(subscribePlate),
	ownPlate: secure(ownPlate)
};