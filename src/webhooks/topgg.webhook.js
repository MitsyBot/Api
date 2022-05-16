const DbSet = require('../database/DbSet');
const gRPC = require('../gRPC/Client');
const axios = require('axios');
const moment = require('moment');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class DblWebhook {

	static async register(req, res) {
		try {
			let premiumBoost = 1;
			let tax = 0.2;

			const premium = await DbSet.getInstance().premium.ensureUserPremium(req.body.user);

			if (premium) {
				premiumBoost = 0.5 + premium.tier;
				tax = 1;
			}

			let amount = (Math.floor(Math.random() * 900) + 900) * premiumBoost;
			const taxValue = Math.floor(amount * tax);

			if (!premium) {
				amount = amount - taxValue;
			}

			amount = Math.floor(amount);

			await DbSet.getInstance().user.addComets(req.body.user, Number(amount));
			await gRPC.getInstance().user.send(req.body.user, `**Obrigado por votar em mim no TopGG!** Voce recebeu **${amount} Cometinhas** como agradecimento.`);

			const date = `${moment().format('DD/MM/YYYY HH:mm')}`;

			const transaction = await DbSet.getInstance().transactions.create({
				data: {
					reason: 'TOPGG',
					given_by: 'TOPGG',
					received_by: req.body.user,
					quantity: amount,
					given_at: date,
				},
			});

			const websocket = await makeRequest('mitsy',
				{
					id: generateRandomId(),
					type: 'getUser',
					data: { user: req.body.user },
				});
			console.log(websocket);
			const embed = {
				color: 0xF895FB,
				title: `<:Mitsy_Rica:872870327049396274> **${amount} for TOPGG**`,
				fields: [
					{
						name: '**💵 Quem recebeu**',
						value: `<@${req.body.user}>\n \`\`${websocket.username}#${websocket.discriminator}\`\``,
					},
				],
				timestamp: new Date(),
				footer: {
					text: `Transação ${transaction.id}`,
					icon_url: 'https://cdn.discordapp.com/emojis/873019423827587132.webp',
				},
			};

			const request = {
				'username': 'StarTracker',
				'embeds': [embed],
			};
			await axios.post(process.env.STARTRACKER_WEBHOOK, request);


			return res.status(200).json({ message: 'OK' });

		}
		catch (e) {
			switch (e.message) {
			case 'ALREADY_CLAIMED':
				return res.status(400).json({ error: 'Bonus already claimed' });
			case 'NOT_VOTED':
				return res.status(400).json({ error: 'User hasn\'t voted yet' });
			default:
				console.log(e);
				return res.status(500).json({ error: 'Internal server error' });
			}
		}

	}
};
