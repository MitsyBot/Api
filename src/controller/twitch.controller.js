const axios = require('axios');
const twitchUtils = require('../util/twitch');
const DbSet = require('../database/DbSet');
module.exports = class TwitchWebhook {
	static async createEventHook(req, res) {
		try {
			const notify = await twitchUtils.createTwitchNotifyForUser(req, res);
			if (notify.error) return res.status(500).json(notify);


			return res.status(200).json({ sucess: true, message: 'Configurações aplicadas' });
		}
		catch (e) {
			console.log(e);
		}
	}

	static async getTwitchUserByName(req, res) {
		try {
			const twitchUser = await axios.get(`https://api.twitch.tv/helix/users?name=${req.params.user}`, {
				headers: {
					Authorization: `Bearer ${await twitchUtils.getTwitchToken()}`,
					'Client-ID': process.env.TWITCH_CLIENT_ID,
				},
			});
			res.send(twitchUser.data.data[0]);
		}
		catch (e) {
			console.log(e);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

};