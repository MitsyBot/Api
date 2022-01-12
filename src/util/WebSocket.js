const { Server } = require('ws')
const url = require('url')

var ws = null

function GetWS() {
    return ws
}

function InitializeServer(httpServer) {
    ws = new Server({ server: httpServer })

    GetWS().on('connection', (socket, req) => {
        console.log('Um novo cliente se conectou')
        socket.id = url.parse(req.url, true).query.id ?? 0
        socket.isAlive = true;
        socket.uptime = Date.now()
      
        socket.on('pong', (ms) => {
          socket.isAlive = true;
          socket.responseTime = Date.now() - ms.toString();
        })
      })
      
      setInterval(() => {
        GetWS().clients.forEach((skt) => {
          if (skt.isAlive === false) return skt.terminate()
      
          skt.isAlive = false;
          skt.ping(Date.now())
        })
      }, 15000)
}

function makeRequest(toSend) {

    if (!GetWS()) return { err: true };

    GetWS().send(JSON.stringify(toSend));

    return new Promise((res) => {
      if (!GetWS()) return res({ err: true });
      const timeout = setTimeout(() => {
        res({ err: true });
      }, 5000);

      const resolveError = () => {
        clearTimeout(timeout);
        GetWS().removeListener('message', handler);
        return res({ err: true });
      };

      const resolveSuccess = (receivedData) => {
        clearTimeout(timeout);
        GetWS().removeListener('message', handler);
        return res(receivedData);
      };

      const handler = (msg) => {
        const parsedData = JSON.parse(msg.toString());

        if (!parsedData.id) return;
        if (parsedData.id !== toSend.id) return;
        if (!parsedData.res) return resolveError();

        return resolveSuccess({ data: Buffer.from(parsedData.res) });
      };

      GetWS().on('message', handler);
    })
}

module.exports = { InitializeServer, ws, makeRequest }