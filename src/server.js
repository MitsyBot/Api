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


app.use(cors({
	origin: 'https://mitsy.xyz',
}));
app.use(expressip.mw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use((_, res, next) => {
	res.contentType('application/json');
	return next();
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
