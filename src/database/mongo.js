const userSchema = require('./schemas/User');
const guildSchema = require('./schemas/Guild');

module.exports.fetchUser = async function(user) {
	let member = await userSchema.findOne({ id: user });

	if (member) {
		return member;
	}

    else {
		return { message: 'Usuario não encontrado' }
	}
};

module.exports.fetchGuild = async function(guildid) {
	let guild = await guildSchema.findOne({ id: guildid });

	if (guild) {
		return guild;
	}

	else {
		return { message: 'Servidor não encontrado' }
	}
};