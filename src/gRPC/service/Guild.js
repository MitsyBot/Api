const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './protos/discord.proto';

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const GuildServiceProto = grpc.loadPackageDefinition(packageDefinition).GuildService;

module.exports = class GuildService {
	constructor() {
		this.client = new GuildServiceProto(
			process.env.DISCORD_GRPC_SERVER,
			grpc.credentials.createInsecure(),
		);
	}

	async checkCommon(guild) {
		const param = {
			guild,
		};

		const request = await new Promise((resolve, reject) => {
			this.client.checkCommon(param, (err, res) => {
				if (err) {
					console.log(err);
					reject({ err: true, message: err.message });
					return;
				}

				resolve(res);
			});
		});

		return request;
	}

	async getFlattenGuild(id) {

		const param = {
			id,
		};

		const request = await new Promise((resolve, reject) => {
			this.client.getFlattenGuild(param, (err, res) => {
				if (err) {
					console.log(err);
					reject({ err: true, message: err.message });
					return;
				}

				resolve(res);
			});
		});

		return request;
	}
};