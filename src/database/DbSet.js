const { UserRepository, GuildRepository, BlacklistRepository, FanartRepository, PremiumRepository, BackgroundRepository } = require('./Repositories/');
const { prisma } = require('./prisma');
module.exports = class DbSet {
	constructor() {
		this.connection = prisma;
		this.fanarts = new FanartRepository(prisma);
		this.user = new UserRepository(prisma);
		this.guild = new GuildRepository(prisma);
		this.blacklist = new BlacklistRepository(prisma);
		this.premium = new PremiumRepository(prisma);
		this.backgrounds = new BackgroundRepository(prisma);
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new DbSet();
		}
		return this.instance;
	}
};