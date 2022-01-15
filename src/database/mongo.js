const userSchema = require('./schemas/User');
const guildSchema = require('./schemas/Guild');
const fanartSchema = require('./schemas/Fanarts');

module.exports.fetchUser = async function(user) {
	let member = await userSchema.findOne({ id: user });

	if (member) {
		return member;
	}

    else {
		member = new userSchema({
			id: user,
		});

		await member.save();
		return member;
	}
};

module.exports.fetchGuild = async function(guildid) {
	let guild = await guildSchema.findOne({ id: guildid });

	if (guild) {
		return guild;
	}

	else {
		guild = new guildSchema({
			id: guildid,
		});

		await guild.save();
		return guild;
		}
};

module.exports.fetchFanart = async function(fanartid) {
	let fanart = await fanartSchema.findOne({ id: fanartid });

	if (fanart) {
		return fanart;
	}

	else {
		return { message: 'Fanart não encontrada' }
	}
};

module.exports.getAllArts = async function() {
	let fanarts = await fanartSchema.find();

	if (fanarts) {
		return fanarts;
	}

	else {
		return { message: 'Nenhuma fanart registrada' }
	}
};