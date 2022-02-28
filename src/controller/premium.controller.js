const database = require('../database/mongo');

module.exports = class PremiumController {
	static async createPremium(req, res) {
		const { makeRequest, generateRandomId } = require('../util/WebSocket');

		const tier = () => {
			if (req.price === 19.99) return 1;
			if (req.price === 39.99) return 2;
			if (req.price === 89.99) return 3;
			if (req.price === 119.99) return 4;
		};
		const body = {
			userid: req.body.userid,
			price: req.body.price,
			tier: tier(),
			ref: req.body.ref,
		};

		database.createNewPremium(req.body.userid, tier());

		const request = await makeRequest('mitsy',
			{
				id: generateRandomId(),
				type: 'premiumbuy',
				data: body,
			});

		res.send(request);
	}

	static async activateKey(req, res) {
		const { keyid, guildid } = req.body;

		const isUnique = await database.checkIfGuildHaveKey(guildid);
		if (isUnique) return res.send({ err: true });

		const getKey = await database.getKeyGuild(keyid, req.user.id);
		getKey.guild.isPremium = true;
		getKey.guild.premiumLevel = getKey.key.level;
		getKey.guild.save();

		const mes = database.updateKeyStatus(req, keyid, guildid);
		res.send({ message: mes });
	}
	static async deactivateKey(req, res) {
		const { keyid } = req.body;

		const getKey = await database.getKeyGuild(keyid, req.user.id);
		getKey.guild.isPremium = false;
		getKey.guild.premiumLevel = 0;
		getKey.guild.save();

		const msg = database.deactivateKey(req, keyid);
		res.send({ message: msg });
	}
};