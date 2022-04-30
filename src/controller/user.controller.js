const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class UserController {
	static async getUserKeys(req, res) {
		const premium = await DbSet.getInstance().premium.keys.findMany({ where: { user: req.user.id } });

		res.send({ keys: premium });
	}

	async getUserReps(req, res) {
		const user = await DbSet.getInstance().user.profiles.findOne({ where: { id: req.params.id } });

		const request = await makeRequest('mitsy',
			{
				id: generateRandomId(),
				type: 'getUser',
				data: { id: user.id },
			});


		const body = {
			reps: user.total_reps,
			username: request.data.username,
			id: user.id,
			avatar: request.data.avatar,
		};

		res.send(body);
	}

	static async setUserBanner(req, res) {
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				active_background: req.body.banner,
			},
		});
		res.send({ sucess: true, message: 'Background definido com sucesso' });
	}

	static async setUserColor(req, res) {

		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				color: req.body.color,
			},
		});
		res.send({ sucess: true, message: 'Cor definida com sucesso' });
	}

	static async setUserExtras(req, res) {
		const { aboutme, birthday } = req.body;

		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				aboutme,
				birthday,
			},
		});
		res.send({ sucess: true, message: 'Aboutme definido com sucesso' });
	}

	static async setUserConfigs(req, res) {
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				warn_login: req.body.warn_login,
			},
		});
		res.send({ sucess: true, message: 'Configurações salvas com sucesso' });
	}

	static async setUserBadges(req, res) {
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				active_badges: req.body.badges,
			},
		});

		res.send({ sucess: true, message: 'As badges foram definidas com sucesso' });
	}

	static async GetUserInfos(req, res) {
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);

		const body = {
			badges: {
				all: user.profile.badge_list,
				enabled: user.profile.active_badges,
			},
			colors: {
				list: user.profile.active_colors,
				current: user.profile.color,
			},
			configs: {
				warnLogin: user.profile.warn_login,
			},
			background: user.profile.active_background,
			backgrounds: user.profile.backgrounds,
			extras: {
				aboutme: user.profile.aboutme,
				birthday: user.profile.birthday,
			},
			layouts: user.profile.profiles,
			layout: user.profile.active_profile_design,
		};

		res.send(body);
	}
};