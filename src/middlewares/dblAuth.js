const Joi = require('joi');

module.exports = (req, res, next) => {
	const authorization = req.get('Authorization');
	if (authorization && authorization === process.env.DBL_WEBHOOK_SECRET) {
		const payload = req.body;
		if (payload !== {}) {
			next();
		}
		else {return res.status(400).json({ error: 'No body' });}
	}
	else {return res.status(401).json({ error: 'Invalid Authorization header' });}
};