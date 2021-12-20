const WebSocket = require('ws')

module.exports = class MitsyWebSocket {


      constructor() {}

    async connect() {
      try {
        this.ws = new WebSocket(`${process.env.BOT_WEBSOCKET}`);
        this.prepareListeners();
        console.log(`[WEBSOCKET] Client esta tentando se conectar ao servidor`);
      } catch (err) {
        if (err instanceof Error) console.log(`[WEBSOCKET] Errro ao conectar: ${err.message}`);
        this.ws = null;
        this.isAlive = false;
      }
    }
  
    onError(err) {
      this.ruuningError = true;
      this.isAlive = false;
      if (this.retries >= 5) {
        console.log(`[WEBSOCKET] Cliente não vai mais tentar se conectar ao servidor (passou de 5 tentativas)`);
        if (this.ws) this.ws.removeAllListeners();
        return;
      }
  
      console.log(`[WEBSOCKET] Error: ${err.message}`);
      if (this.pingTimeout) clearTimeout(this.pingTimeout);
  
      setTimeout(() => {
        this.retries += 1;
        this.connect();
      }, 15000);
    }
  
    heartbeat(data) {
      this.ruuningError = false;
      if (typeof this.pingTimeout !== 'undefined') clearTimeout(this.pingTimeout);
  
      this.isAlive = true;
      if (data) this.ws.pong(data);
  
      this.pingTimeout = setTimeout(
        (manager) => {
          if (manager && manager.readyState === manager.OPEN) manager.terminate();
        },
        20000,
        this.ws,
      );
    }
  
    onClose() {
      this.isAlive = false;
      console.log(`[WEBSOCKET] Conexão fechada`);
      if (this.ruuningError) return;
      if (this.ws) this.ws.terminate();
      if (this.pingTimeout) clearTimeout(this.pingTimeout);
  
      setTimeout(() => {
        this.connect();
      }, 5000);
    }
  
    prepareListeners() {
      if (!this.ws) return;
  
      this.ws
        .on('open', () => {
          console.log(`[WEBSOCKET] Cliente conectado com sucesso`);
          this.retries = 0;
          this.heartbeat();
        })
        .on('close', () => this.onClose())
        .on('error', (err) => this.onError(err))
        .on('ping', (data) => this.heartbeat(data));
    }
  
    async makeRequest(toSend) {
      if (!this.isAlive) return { err: true };
      if (!this.ws) return { err: true };
  
      this.ws.send(JSON.stringify(toSend));
  
      return new Promise((res) => {
        if (!this.ws) return res({ err: true });
        const timeout = setTimeout(() => {
          res({ err: true });
        }, 5000);
  
        const resolveError = () => {
          clearTimeout(timeout);
          this.ws.removeListener('message', handler);
          return res({ err: true });
        };
  
        const resolveSuccess = (receivedData) => {
          clearTimeout(timeout);
          this.ws.removeListener('message', handler);
          return res(receivedData);
        };
  
        const handler = (msg) => {
          const parsedData = JSON.parse(msg.toString());
  
          if (!parsedData.id) return;
          if (parsedData.id !== toSend.id) return;
          if (!parsedData.res) return resolveError();
  
          return resolveSuccess({ data: Buffer.from(parsedData.res) });
        };
  
        this.ws.on('message', handler);
      });
    }
  }