const userSchema = require('./schemas/User');
const guildSchema = require('./schemas/Guild');
const fanartSchema = require('./schemas/Fanarts');
const backgroundSchema = require('./schemas/Backgrounds')

module.exports.fetchUser = async function(user) {
	let member = await userSchema.findOne({ id: user });

	if (member) {
		return member;
	}

    else {
		member = new userSchema({
			_id: user,
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
			_id: guildid,
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

module.exports.getAllBackgrounds = async function() {
	let backgrounds = await backgroundSchema.find();

	if (backgrounds) {
		return backgrounds;
	}

	else {
		return { message: 'Nenhum background encontrado' }
	}
};