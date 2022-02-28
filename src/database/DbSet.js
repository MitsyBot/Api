const { UserRepository, GuildRepository, BlacklistRepository, FanartRepository, PremiumRepository } = require('./repositories/');
module.exports = class DbSet {
	constructor(connection) {
		this.connection = connection;
		this.fanarts = new FanartRepository(connection);
		this.user = new UserRepository(connection);
		this.guild = new GuildRepository(connection);
		this.blacklist = new BlacklistRepository(connection);
		this.premium = new PremiumRepository(connection);
	}

	static getInstance(prisma) {
		if (!this.instance) {
			this.instance = new DbSet(prisma);
		}

		return this.instance;
	}
};