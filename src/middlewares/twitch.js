const crypto = require('crypto');

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

const HMAC_PREFIX = 'sha256=';

module.exports = (req, res, next) => {
	const secret = getSecret();
	const message = getHmacMessage(req);
	const hmac = HMAC_PREFIX + getHmac(secret, message);

	if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE]) === true) {
		console.log('signatures match');
		const notification = JSON.parse(req.body);

		if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
			return next();
		}
		else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
			res.status(200).send(notification.challenge);
		}
		else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
			res.sendStatus(204);

			console.log(`${notification.subscription.type} notifications revoked!`);
			console.log(`reason: ${notification.subscription.status}`);
			console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
		}
		else {
			res.sendStatus(204);
			console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
		}
	}
	else {
		console.log('403');
		res.sendStatus(403);
	}
};

function getSecret() {
	return 'q8gk6sxxfb7moqta5hgoyuipjm5i0b';
}

function getHmacMessage(request) {
	return (request.headers[TWITCH_MESSAGE_ID] + request.headers[TWITCH_MESSAGE_TIMESTAMP] + JSON.stringify(request.body));
}

function getHmac(secret, message) {
	return crypto.createHmac('sha256', secret)
		.update(message)
		.digest('hex');
}

function verifyMessage(hmac, verifySignature) {
	return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}
