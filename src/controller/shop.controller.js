const ShopController = require('../util/ShopController');
const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

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

		res.send({ sucess: true, message: 'Cor comprada com sucesso' });
	}

	static async allBackgrounds(req, res) {
		const backgrounds = await DbSet.getInstance().backgrounds.bgs.findMany();

		res.send(backgrounds);
	}


	static async sendBackground(req, res) {
		const { background, url, user } = req.body;

		const body = {
			background,
			url,
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
};