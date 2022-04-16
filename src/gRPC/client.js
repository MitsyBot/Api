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

const GuildService = grpc.loadPackageDefinition(packageDefinition).GuildService;

const client = new GuildService(
	'localhost:50051',
	grpc.credentials.createInsecure(),
);
module.exports = function getCommon() {
	client.checkCommon({ guild: '762067337913565204' }, (error, common) => {
		if (!error) throw error;
		console.log(common);
	});
};