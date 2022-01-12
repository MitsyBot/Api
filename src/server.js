const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const NotFound = require('./middlewares/NotFound')
const ErrorHandler = require('./middlewares/ErrorHandler')
const ApiRoutes = require('./routes')
const mongoose = require('mongoose');
const mongourl = process.env.MONGO_URL
const { getWs, InitializeServer } = require('./util/WebSocket')

const app = express()

const ws = getWs()

const startTime = Date.now()

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

app.get('/ping', (_, res) => {
  const clients = []
  console.log(ws)
  ws.clients.forEach(a => clients.push({ id: a.id, ping: a.responseTime, uptime: Date.now() - a.uptime }))
  res.status(200).json({ http: { uptime: Date.now() - startTime }, ws: [...ws.clients.values()].map(a => ({ id: Number(a.id), ping: a.responseTime, uptime: Date.now() - a.uptime })) })
})

app.use('/', limiter, ApiRoutes);

app.use(NotFound);
app.use(ErrorHandler);


mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    return console.warn(`Não foi possível se conectar a database: ${err}`);
  }

  console.info('Conectado a database');
});

const httpServer = app.listen(process.env.PORT, () => {
  console.info(`[API] Servidor iniciado na porta ${process.env.PORT}`);
});

InitializeServer(httpServer)