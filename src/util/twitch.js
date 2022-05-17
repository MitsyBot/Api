const DbSet = require('../database/DbSet');
const axios = require('axios');

module.exports = class twitchUtils {
	static async getTwitchToken() {

		let client;

		client = await DbSet.getInstance().client.findUnique({
			where: {
				id: process.env.CLIENT_ID,
			},
		});

		if (!client) {
			client = await DbSet.getInstance().client.create({
				data: {
					id: process.env.CLIENT_ID,
				},
			});
		}

		let response;
		try {
			response = await axios.get('https://id.twitch.tv/oauth2/validate', {
				headers: {
					'Authorization': `Bearer ${client.twitch_token}`,
				},
			});
		}
		catch (e) {
			response = null;
		}

		if (!response || response.status !== 200 || response.data.client_id !== process.env.CLIENT_ID) {
			const newToken = await axios({
				method: 'post',
				url: 'https://id.twitch.tv/oauth2/token',
				data: {
					'client_id': '1rbi57pr76625ll8gg5ghh88vlhcvq',
					'client_secret': 'q8gk6sxxfb7moqta5hgoyuipjm5i0b',
					'grant_type': 'client_credentials',
				},
			});

			await DbSet.getInstance().client.update({
				where: {
					id: process.env.CLIENT_ID,
				},
				data: {
					twitch_token: newToken.data.access_token,
				},
			});

			return newToken.data.access_token;
		}

		return client.twitch_token;
	}

	// eslint-disable-next-line no-unused-vars
	static async createTwitchNotifyForUser(req, _res) {
		const token = await this.getTwitchToken();
		try {
			const { twitch_id, guild } = req.body;
			if (!twitch_id || !guild) return { error: true, message: 'Missing twitch_id or guild' };

			const twitchUser = await DbSet.getInstance().twitchNotify.findUnique({
				where: {
					twitch_id,
				},
			});

			if (!twitchUser) {
				await DbSet.getInstance().twitchNotify.create({
					data: {
						twitch_id,
					},
				});
			}

			const headers = {
				'Client-ID': process.env.TWITCH_CLIENT_ID,
				'Authorization': `Bearer ${token}`,
			};

			const allStreamers = await axios({
				method: 'get',
				url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
				headers,
			});

			const all = allStreamers.data.data.filter(obj => {
				return obj.condition.broadcaster_user_id === twitch_id;
			});

			if (all.length < 2) {
				const update_status = await axios({
					method: 'post',
					url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
					data: {
						'type':'channel.update',
						'version':'1',
						'condition':{
							'broadcaster_user_id': twitch_id,
						},
						'transport':{
							'method':'webhook',
							'callback':'https://api.mitsy.xyz/webhooks/twitch/game',
							'secret': process.env.TWITCH_SECRET,
						},
					},
					headers,
				});

				const update2 = await axios({
					method: 'post',
					url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
					data: {
						'type':'stream.online',
						'version':'1',
						'condition':{
							'broadcaster_user_id': twitch_id,
						},
						'transport':{
							'method':'webhook',
							'callback':'https://api.mitsy.xyz/webhooks/twitch/online',
							'secret': process.env.TWITCH_SECRET,
						},
					},
					headers,
				});

				await DbSet.getInstance().twitchNotify.update({
					where: {
						twitch_id,
					},
					data: {
						game_update_id: update_status.data.data[0].id,
						come_online_id: update2.data.data[0].id,
					},
				});
			}

			return { message: 'Success' };
		}
		catch (e) {
			console.log(e);
			return { error: true, message: 'Internal server error' };
		}
	}
};

