const DbSet = require('../database/DbSet');

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

		DbSet.getInstance().premium.createPremiumAndKey(req.body.userid, tier(), req.body.price);

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

		const isUnique = await DbSet.getInstance().premium.ensureGuildKey(guildid);
		if (isUnique) return res.send({ err: true });

		DbSet.getInstance().premium.enableKey(keyid, guildid);
		res.send({ message: 'Chave ativada com sucesso' });
	}
	static async deactivateKey(req, res) {
		const { keyid } = req.body;

		DbSet.getInstance().premium.disableKey(keyid);
		res.send({ message: 'Chave desativada com sucesso' });
	}
};