module.exports = class TwitchWebhook {

	static async online(req, res) {
		try {
			const { event } = req.body;
			// Terminar de implementar
			console.log(event.broadcaster_user_login);

			return res.status(200).json({ message: 'OK' });
		}
		catch (e) {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	static async gameChange(req, res) {
		try {
			const { event } = req.body;
			console.log(event.category_name);

			return res.status(200).json({ message: 'OK' });
		}
		catch (e) {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};