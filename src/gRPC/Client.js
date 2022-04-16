const GuildService = require('./service/Guild');

module.exports = class GrpcClient {
	constructor() {
		this.guild = new GuildService();
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
