const { Server } = require('ws');

let ws = null;
let startTime = null;

function random(min, max) {
	return Math.floor(
		Math.random() * (max - min) + min,
	);
}

function InitializeServer(httpServer) {
	startTime = Date.now();

	ws = new Server({ server: httpServer });

	// eslint-disable-next-line no-unused-vars
	ws.on('connection', (socket, _req) => {
		console.log('Um novo cliente se conectou');
		socket.id = random('1', '10');
		socket.isAlive = true;
		socket.uptime = Date.now();

		socket.on('message', (raw) => {

			const data = JSON.parse(raw.toString());

			if (data.client_type) {
				socket.client = data.client_type;
			}
		});

		socket.on('pong', (ms) => {
			socket.isAlive = true;
			socket.responseTime = Date.now() - ms.toString();
		});
	});

	setInterval(() => {
		ws.clients.forEach((skt) => {
			if (skt.isAlive === false) return skt.terminate();

			skt.isAlive = false;
			skt.ping(Date.now());
		});
	}, 15000);
}

function makeRequest(client, toSend) {

	if (!ws) return { err: true };

	const socket = Array.from(ws.clients.values()).filter((skt) => {
		return skt.client.includes(client);
	});

	const bocket = socket[0];

	if (!bocket) return { err: true };

	bocket.send(JSON.stringify(toSend));

	return new Promise((res) => {
		if (!bocket) return res({ err: true });
		const timeout = setTimeout(() => {
			res({ err: true });
		}, 20000);

		const resolveError = () => {
			clearTimeout(timeout);
			bocket.removeListener('message', handler);
			return res({ err: true });
		};

		const resolveSuccess = (receivedData) => {
			clearTimeout(timeout);
			bocket.removeListener('message', handler);
			return res(receivedData);
		};

		const handler = (msg) => {
			const parsedData = JSON.parse(msg.toString());

			if (!parsedData.id) return;
			if (parsedData.id !== toSend.id) return;
			if (!parsedData.res) return resolveError();

			return resolveSuccess({ data: parsedData.res });
		};

		bocket.on('message', handler);
	});
}

function pingPage(app) {
	app.get('/ping', (_, res) => {
		const clients = [];
		ws.clients.forEach(a => clients.push({ id: a.id, ping: a.responseTime, uptime: Date.now() - a.uptime }));
		res.status(200).json({ http: { uptime: Date.now() - startTime }, ws: [...ws.clients.values()].map(a => ({ id: Number(a.id), client: a.client, ping: a.responseTime, uptime: Date.now() - a.uptime })) });
	});
}

function generateRandomId() {
	return Math.floor(
		Math.random() * (1 - 200000000000000000) + 1,
	);
}

module.exports = { InitializeServer, generateRandomId, pingPage, makeRequest };