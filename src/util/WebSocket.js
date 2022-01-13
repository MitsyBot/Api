const { Server } = require('ws')
const url = require('url')

var ws = null
var startTime = null

function InitializeServer(httpServer) {
    startTime = Date.now()

    ws = new Server({ server: httpServer })

    ws.on('connection', (socket, req) => {
        console.log('Um novo cliente se conectou')
        socket.id = url.parse(req.url, true).query.id ?? 0
        socket.isAlive = true;
        socket.uptime = Date.now()
        
        socket.on('message', (raw) => {
        
        const data = JSON.parse(raw.toString());

        if(data.client_type){
        socket.client = data.client_type
        }
        })

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
}

function makeRequest(client, toSend) {

    if (!ws) return { err: true };

    ws.send(JSON.stringify(toSend));

    console.log(ws.clients);

    return new Promise((res) => {
      if (!ws) return res({ err: true });
      const timeout = setTimeout(() => {
        res({ err: true });
      }, 5000);

      const resolveError = () => {
        clearTimeout(timeout);
        ws.removeListener('message', handler);
        return res({ err: true });
      };

      const resolveSuccess = (receivedData) => {
        clearTimeout(timeout);
        ws.removeListener('message', handler);
        return res(receivedData);
      };

      const handler = (msg) => {
        const parsedData = JSON.parse(msg.toString());

        if (!parsedData.id) return;
        if (parsedData.id !== toSend.id) return;
        if (!parsedData.res) return resolveError();

        return resolveSuccess({ data: Buffer.from(parsedData.res) });
      };

      ws.on('message', handler);
    })
}

function pingPage(app) {
    app.get('/ping', (_, res) => {
        const clients = []
        ws.clients.forEach(a => clients.push({ id: a.id, ping: a.responseTime, uptime: Date.now() - a.uptime }))
        res.status(200).json({ http: { uptime: Date.now() - startTime }, ws: [...ws.clients.values()].map(a => ({ id: Number(a.id), client: a.client, ping: a.responseTime, uptime: Date.now() - a.uptime })) })
      })
}

module.exports = { InitializeServer, pingPage, makeRequest }