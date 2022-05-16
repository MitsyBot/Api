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
const UserServiceProto = grpc.loadPackageDefinition(packageDefinition).UserService;

module.exports = class UserService {
	constructor() {
		this.user = new UserServiceProto(
			process.env.DISCORD_GRPC_SERVER,
			grpc.credentials.createInsecure(),
		);
	}

	async send(id, message) {
		const param = {
			id,
			message,
		};

		const request = await new Promise((resolve, reject) => {
			this.user.send(param, (err, res) => {
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