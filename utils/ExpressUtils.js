const secured = (user)=>{
	if (!user){
		throw new Error("You shall not pass");
	}
}

module.exports.secure = (fn)=> {
	return async (data, {user})=>{
		secured(user);
		return await fn(data, user);
	}
}