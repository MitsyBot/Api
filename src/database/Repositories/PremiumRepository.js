module.exports = class GuildRepository {
	constructor(connection) {
		this.payments = connection.Payments;
		this.donations = connection.UserDonations;
		this.keys = connection.DonationKeys;
	}
	async ensureUserPremium(id) {
		const previous = await this.donations.findUnique({ where: { id, expired: false } });
		return previous;
	}
	async ensureKey(id) {
		const previous = await this.keys.findUnique({ where: { id } });
		return previous;
	}
	async createPremiumAndKey(id, tier, price) {
		const key_id = `MITSY-PREMIUM-KEY-${Math.floor(Math.random() * 10000000000)}`;
		await this.keys.create({
			data: {
				id: key_id,
				user: id,
				value: price,
				tier,
				expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30,
				metadata: {},
			},
		});
		await this.donations.create({
			data: {
				id,
				expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30,
				enabled_at: Date.now(),
				tier: tier,
			},
		});
		return { message: 'Key e premium ativados' };
	}
	async ensureGuildKey(id) {
		const previous = await this.keys.findUnique({ where: { active_in: id } });
		return previous;
	}
	async enableKey(id, guild) {
		return await this.keys.update({
			where: {
				id,
			},
			data: {
				active_in: guild,
			},
		});
	}
	async disableKey(id) {
		return await this.keys.update({
			where: {
				id,
			},
			data: {
				active_in: null,
			},
		});
	}
};