const ShopController = require('../util/ShopController');
const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');
const axios = require('axios');

module.exports = class SimpleShop {
	static async getRandomBackgrounds(_req, res) {
		const backgrounds = ShopController.getInstance().getBackgrounds();

		return res.status(200).json(backgrounds);
	}
	static async buyBackground(req, res) {
		const { banner } = req.body;
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);
		const backgrounds = await user.profile.backgrounds;
		if (backgrounds.includes(banner.id)) return res.send({ sucess: false, message: 'Você ja tem este banner' });
		if (user.profile.comets < Number(banner.price)) return res.send({ sucess: false, message: 'Você não tem cometinhas para comprar este background' });

		await DbSet.getInstance().user.removeComets(req.user.id, banner.price);
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				backgrounds: {
					push: banner.id,
				},
			},
		});

		const transaction = await DbSet.getInstance().transactions.create({
			data: {
				reason: 'BACKGROUND',
				given_by: 'SHOP',
				received_by: req.user.id,
				quantity: banner.price,
				given_at: Date.now(),
			},
		});

		const embed = {
			color: 0xF895FB,
			title: `<:Mitsy_Rica:872870327049396274> **${banner.cost} for BACKGROUND**`,
			fields: [
				{
					name: '**💸 Quem pagou**',
					value: `<@${req.user.id}>\n \`\`${req.user.username}#${req.user.discriminator}\`\``,
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


		res.send({ sucess: true, message: 'Background comprado com sucesso' });
	}

	static async getColors(_req, res) {
		const colors = await DbSet.getInstance().colors.findMany();
		return res.send(colors);
	}

	static async buyColor(req, res) {
		const { color } = req.body;
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);
		const colors = await user.profile.active_colors;
		if (colors.includes(color.id)) return res.send({ sucess: false, message: 'Você ja tem esta cor' });
		if (user.profile.comets < Number(color.cost)) return res.send({ sucess: false, message: 'Você não tem cometinhas para comprar esta cor' });

		await DbSet.getInstance().user.removeComets(req.user.id, color.cost);
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				active_colors: {
					push: color.id,
				},
			},
		});

		const transaction = await DbSet.getInstance().transactions.create({
			data: {
				reason: 'COLOR',
				given_by: 'SHOP',
				received_by: req.user.id,
				quantity: color.cost,
				given_at: Date.now(),
			},
		});

		const embed = {
			color: 0xF895FB,
			title: `<:Mitsy_Rica:872870327049396274> **${color.cost} for COLOR**`,
			fields: [
				{
					name: '**💸 Quem pagou**',
					value: `<@${req.user.id}>\n \`\`${req.user.username}#${req.user.discriminator}\`\``,
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

		res.send({ sucess: true, message: 'Cor comprada com sucesso' });
	}

	static async allBackgrounds(req, res) {
		const backgrounds = await DbSet.getInstance().backgrounds.bgs.findMany();

		res.send(backgrounds);
	}


	static async sendBackground(req, res) {
		const { background, file } = req.body;
		const user = req.user;
		const body = {
			background,
			file,
			user,
		};

		await makeRequest('helper',
			{
				id: generateRandomId(),
				type: 'background',
				data: body,
			});

		res.send({ sucess: true, message: 'O background foi enviado para a equipe' });
	}

	static async createBackground(req, res) {
		const { id, name, collection, rarity, from } = req.body;

		const price = Number(rarity) * 7000;
		await DbSet.getInstance().backgrounds.bgs.create({
			data: {
				id,
				collection,
				title: name,
				rarity: Number(rarity),
				authorId: from,
				price,
			},
		});
		res.send({ sucess: true, message: 'O background foi enviado para a database' });
	}
};