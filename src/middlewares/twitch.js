const crypto = require('crypto');

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const HMAC_PREFIX = 'sha256=';

module.exports = (req, res, next) => {
	if (!req.headers[TWITCH_MESSAGE_SIGNATURE]) return res.sendStatus(500);
	if (!req.headers[TWITCH_MESSAGE_TIMESTAMP]) return res.sendStatus(500);
	if (!req.headers[TWITCH_MESSAGE_ID]) return res.sendStatus(500);

	const typeRequest = req.get('twitch-eventsub-message-type');
	const Challenge = Boolean(typeRequest === 'webhook_callback_verification');
	if (Challenge) {
		return res.send(req.body.challenge);
	}
	const secret = process.env.API_TOKEN;
	const message = getHmacMessage(req);
	const hmac = HMAC_PREFIX + getHmac(secret, message);

	if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE]) === true) {
		return next();
	}
	else {
		console.log('nem passou');
		res.sendStatus(403);
	}

};

function getHmacMessage(request) {
	return (request.headers[TWITCH_MESSAGE_ID] +
        request.headers[TWITCH_MESSAGE_TIMESTAMP] +
        request.body);
}

function getHmac(secret, message) {
	return crypto.createHmac('sha256', secret)
		.update(message)
		.digest('hex');
}

function verifyMessage(hmac, verifySignature) {
	return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}