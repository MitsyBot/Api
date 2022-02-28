const DbSet = require('../database/DbSet');

module.exports = class UserController {
	static async getUserKeys(req, res) {
		const premium = DbSet.getInstance().premium.keys.findUnique({ where: { user: req.user.id } });
		res.send({ keys: premium });
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

	static async setUserAboutme(req, res) {
		await DbSet.getInstance().user.profiles.update({
			where: {
				id: req.user.id,
			},
			data: {
				aboutme: req.body.aboutme,
			},
		});
		res.send({ sucess: true, message: 'Aboutme definido com sucesso' });
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
			background: user.profile.active_background,
			backgrounds: user.profile.backgrounds,
			aboutme: user.profile.aboutme,
			layouts: user.profile.profiles,
			layout: user.profile.active_profile_design,
		};

		res.send(body);
	}
};