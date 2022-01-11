const express = require('express')
const cors = require('cors')
const http = require('http')
const rateLimit = require('express-rate-limit')
const NotFound = require('./middlewares/NotFound')
const ErrorHandler = require('./middlewares/ErrorHandler')
const ApiRoutes = require('./routes')
const mongoose = require('mongoose');
const mongourl = process.env.MONGO_URL
const { Server } = require('ws')

const app = express()
const server = http.createServer(app)


const ws = new Server({ server: server });

ws.on('connection', (socket, req) => {
  console.log('[Websocket] Uma nova conexão foi realizada')
  socket.id = url.parse(req.url, true).query.id ?? 0
  socket.isAlive = true;
  socket.uptime = Date.now()

  socket.on('pong', (ms) => {
    socket.isAlive = true;
    socket.responseTime = Date.now() - ms.toString();
  })
})

setInterval(() => {
  ws.clients.forEach((skt) => {
    if (skt.isAlive === false) return skt.terminate()

    skt.isAlive = false;
    skt.ping(Date.now())
  })
}, 15000)

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

app.use('/', limiter, ApiRoutes);

app.use(NotFound);
app.use(ErrorHandler);


mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    return console.warn(`Não foi possível se conectar a database: ${err}`);
  }

  console.info('Conectado a database');
});

server.listen(process.env.PORT, () => {
  console.info(`[API] Servidor iniciado na porta ${process.env.PORT}`);
});
