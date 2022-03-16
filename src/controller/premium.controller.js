const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class PremiumController {
	static async createPremium(req, res) {

		const tier = () => {
			if (req.price === 19.99) return 1;
			if (req.price === 39.99) return 2;
			if (req.price === 89.99) return 3;
			if (req.price === 119.99) return 4;
		};
		const body = {
			message: `Oba, parece que você comprou ${req.body.ref} no valor de ${req.body.price}, Seu pagamento foi aprovado e seu premium ja esta ativado na sua conta! Agora você possui o mitsy premium tier ${tier()}. divirta-se!`,
			userid: req.body.userid,
		};

		DbSet.getInstance().premium.createPremiumAndKey(req.body.userid, tier(), req.body.price);

		const request = await makeRequest('mitsy',
			{
				id: generateRandomId(),
				type: 'message',
				data: body,
			});

		res.send(request);
	}

	static async activateKey(req, res) {
		const { keyid, guildid } = req.body;

		const isUnique = await DbSet.getInstance().premium.keys.count({
			where: {
				active_in: guildid,
			},
		});
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