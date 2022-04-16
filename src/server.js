const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NotFound = require('./middlewares/NotFound');
const ErrorHandler = require('./middlewares/ErrorHandler');
const ApiRoutes = require('./routes');
const prisma = require('./database/prisma');
const expressip = require('request-ip');
const { pingPage, InitializeServer } = require('./util/WebSocket');
const app = express();
const ShopController = require('./util/ShopController');
const limiter = rateLimit({
	windowMs: 5 * 1000,
	max: 15,
	skip: (req) => req.headers['user-agent'] === process.env.AGENT,
	handler: (_req, res) => {
		res.status(429).send({ message: 'Suas ações estão sendo limitadas' });
	},
});

app.use(cors());
app.use(expressip.mw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use((_, res, next) => {
	res.contentType('application/json');
	return next();
});

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
	'198.12.96.170:50051',
	grpc.credentials.createInsecure(),
);
const param = {
	common: '762067337913565204',
};
console.log(client);
client.checkCommon(param, (err, res) => {
	if (err) {
		return console.error('healthCheck:', err);
	}

	const { status } = res;

	console.info('healthCheck:', status);
});


pingPage(app);
prisma.getConnection();
app.use('/', limiter, ApiRoutes);

app.use(NotFound);
app.use(ErrorHandler);
ShopController.getInstance().init();
const httpServer = app.listen(process.env.PORT, () => {
	console.info(`[API] Servidor iniciado na porta ${process.env.PORT}`);
});

InitializeServer(httpServer);
