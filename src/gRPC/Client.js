const GuildService = require('./service/Guild');
const UserService = require('./service/User');

module.exports = class GrpcClient {
	constructor() {
		this.guild = new GuildService();
		this.user = new UserService();
	}

	init() {
		console.log('Servidor gRPC conectado');
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new GrpcClient();
		}

		return this.instance;
	}
};
