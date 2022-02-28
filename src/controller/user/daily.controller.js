const DbSet = require('../../database/DbSet');
const DAILY_INTERVAL = 24 * 60 * 60 * 1000;

module.exports = class DailyController {

	static async getDailyInfos(req, res) {
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);
		res.status(200).json({
			canDaily: Boolean(Date.now() - user.cooldowns.last_daily < DAILY_INTERVAL),
			isPremium: false,
		});
	}

	static async postDaily(req, res) {
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);

		if (Date.now() - user.cooldowns.last_daily < DAILY_INTERVAL) {
			return res.status(200).json({
				canDaily: false,
			});
		}

		let premiumBoost = 1;
		let tax = 0.2;

		const premium = DbSet.getInstance().premium.ensureUserPremium(req.user.id);

		if (premium) {
			premiumBoost = 0.5 + premium.tier;
			tax = 1;
		}

		let amount = (Math.floor(Math.random() * 2000) + 2000) * premiumBoost;
		const taxValue = Math.floor(amount * tax);

		if (!premium) {
			amount = amount - taxValue;
		}

		amount = Math.floor(amount);

		await DbSet.getInstance().user.addComets(req.user.id, amount);
		await DbSet.getInstance().user.cooldowns.update({
			where: {
				id: req.user.id,
			},
			data: {
				last_daily: Date.now(),
			},
		});


		res.status(200).json({
			received: amount,
			notPremiumReceive: amount + taxValue,
			isPremium: Boolean(premium),
		});
	}

};