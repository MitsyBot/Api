module.exports = (req, res, next) => {
	const typeRequest = req.get('twitch-eventsub-message-type');
	const Challenge = Boolean(typeRequest === 'webhook_callback_verification');
	if (Challenge) {
		return res.send(req.body.challenge);
	}

	return next();
};