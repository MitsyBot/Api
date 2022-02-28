const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class TicketController {

	static async open(req, res) {
		const body = {
			user: {
				name: req.user.username,
				id: req.user.id,
			},
		};
		if (!req.user) return res.status(400).json({ err: true });

		const request = await makeRequest('helper',
			{
				id: generateRandomId(),
				type: 'ticket',
				data: body,
			});
		return res.status(200).json(request);
	}

};
