const { UserRepository, GuildRepository, BlacklistRepository, FanartRepository, PremiumRepository, BackgroundRepository } = require('./repositories/');
module.exports = class DbSet {
	constructor(connection) {
		this.connection = connection;
		this.fanarts = new FanartRepository(connection);
		this.user = new UserRepository(connection);
		this.guild = new GuildRepository(connection);
		this.blacklist = new BlacklistRepository(connection);
		this.premium = new PremiumRepository(connection);
		this.backgrounds = new BackgroundRepository(connection);
	}

	static getInstance(prisma) {
		if (!this.instance) {
			this.instance = new DbSet(prisma);
		}

		return this.instance;
	}
};