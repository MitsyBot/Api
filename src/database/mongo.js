const userSchema = require('./schemas/User');
const guildSchema = require('./schemas/Guild');
const fanartSchema = require('./schemas/Fanarts');
const backgroundSchema = require('./schemas/Backgrounds')
const guildBadgeSchema = require('./schemas/GuildBadges')

module.exports.fetchUser = async function(user) {
	let member = await userSchema.findOne({ _id: user });

	if (member) {
		return member;
	}

    else {
		member = new userSchema({
			_id: user,
		});

		await member.save();
		return member;
	}
};

module.exports.fetchGuild = async function(guildid) {
	let guild = await guildSchema.findOne({ _id: guildid });

	if (guild) {
		return guild;
	}

	else {
		guild = new guildSchema({
			_id: guildid,
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

module.exports.getGuildBadges = async function() {
	let badges = await guildBadgeSchema.find();

	if (badges) {
		return badges;
	}

	else {
		return { message: 'Nenhuma badge encontrada' }
	}
};


module.exports.createNewPremium = async function(user, tier) {
	let member = await userSchema.findOne({ _id: user });

	if (member) {
		const keyid = `MITSY-PREMIUM-KEY-${Math.floor(Math.random() * 10000000000)}`

	const key = {
		id: keyid,
		enabled: false,
		guild: '',
		level: tier
	  }

	  member.premium.time = Date.now();
	  member.premium.tier = tier
	  member.premium.keys.push(key)
	  member.save()

	 return { message: 'Key e premium ativados' }
	}

    else {
		member = new userSchema({
			_id: user,
		});
		const keyid = `MITSY-PREMIUM-KEY-${Math.floor(Math.random() * 10000000000)}`

		const key = {
			id: keyid,
			enabled: false,
			guild: '',
			level: tier
		  }
	
		  member.premium.time = Date.now();
		  member.premium.tier = tier
		  member.premium.keys.push(key)
		  member.save()
	
		 return { message: 'Key e premium ativados' }
	}
}

module.exports.updateKeyStatus = async function (req, keyid, guildid) {
	const query = { id: req.user.id, "premium.keys.id": keyid };
      const updateDocument = {
        $set: { "premium.keys.$.enabled": true,
				"premium.keys.$.guild": guildid },
      };
      await userSchema.updateOne(query, updateDocument);
	  return { message: 'Chave ativada com sucesso' }
}

module.exports.deactivateKey = async function (req, keyid) {
	const query = { id: req.user.id, "premium.keys.id": keyid };
      const updateDocument = {
        $set: { "premium.keys.$.enabled": false,
				"premium.keys.$.guild": '' },
      };
      await userSchema.updateOne(query, updateDocument);
	  return { message: 'Chave desativada com sucesso' }
}

module.exports.checkIfGuildHaveKey = async function (guildid) {
	const key = await userSchema.findOne({ "premium.keys.guild": guildid });
	return Boolean(key)
}

module.exports.getKeyGuild = async function (keyid, userid) {
	const userkey = await userSchema.findOne({ id: userid, "premium.keys.id": keyid });
	let key = userkey.premium.keys
	
	key = key.filter((key) => {
		return key.id === keyid
	  })
	key = key[0]

	let guild = await guildSchema.findOne({ id: key.guild });

	if (guild) {
		return { guild, key }
	}

	else {
		guild = new guildSchema({
			_id: key.guild,
			id: key.guild,
		});

		await guild.save();
		return { guild, key }
	}
}