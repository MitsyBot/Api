const express = require('express')
const cors = require('cors')
const http = require('http')
const rateLimit = require('express-rate-limit')

const NotFound = require('./middlewares/NotFound')
const ErrorHandler = require('./middlewares/ErrorHandler')
const isAuthorized = require('./middlewares/isAuth')

const ApiRoutes = require('./routes')

const app = express()
const server = http.createServer(app)

const limiter = rateLimit({
    windowMs: 5 * 1000,
    max: 15,
    skip: (req) => req.headers['user-agent'] === process.env.AGENT,
    handler: (_req, res) => {
      res.status(429).send({ message: 'Suas ações estão sendo limitadas' });
    },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use((_, res, next) => {
  res.contentType('application/json');
  return next();
});

app.use('/', isAuthorized, ApiRoutes);

app.use(NotFound);
app.use(ErrorHandler);

server.listen(process.env.PORT, () => {
  conole.info(`[API] Servidor iniciado na porta ${process.env.PORT}`);
});
