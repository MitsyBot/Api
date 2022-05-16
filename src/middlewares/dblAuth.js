const Joi = require('joi');

module.exports = (req, res, next) => {
	const authorization = req.get('Authorization');
	if (authorization && authorization === process.env.DBL_WEBHOOK_SECRET) {
		const payload = req.body;
		if (payload !== {}) {
			const PayloadSchema = Joi.object().keys({
				bot: Joi.string().min(17).max(18).required(),
				user: Joi.string().min(17).max(18).required(),
				type: Joi.string().equal('upvote').required(),
				query: Joi.string().allow(''),
				isWeekend: Joi.boolean(),
			});
			PayloadSchema.validate(payload).then(() => {
				next();
			}).catch(error => res.status(500).json(error));
		}
		else {return res.status(400).json({ error: 'No body' });}
	}
	else {return res.status(401).json({ error: 'Invalid Authorization header' });}
};