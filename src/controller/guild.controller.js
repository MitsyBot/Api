const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');
module.exports = class GuildController {
	static async GetIndexGuildConfig(req, res) {
		const guild = await DbSet.getInstance().guild.ensure(req.headers['guild']);
		const blacklist = await DbSet.getInstance().blacklist.ensureGuildBlacklistInfos(req.headers['guild']);

		const request = await makeRequest('mitsy',
			{
				id: generateRandomId(),
				type: 'guild',
				data: {
					guildId: guild.id,
					userId: req.user.id,
				},
			});

		request.data.blacklist = blacklist;
		/* request.data.isPremium = guild.isPremium,
		request.data.premiumTier = guild.premiumLevel, */
		request.data.locale = guild.lang,
		request.data.blacklistedChannels = {
			channels: guild.blacklisted_channels,
			warn: guild.custom_warn_message,
		};
		console.log(request);
		res.send(request.data);
	}
	static async SetIndexGuildConfig(req, res) {
		const blacklisted = req.body.blacklisted;
		const channels = blacklisted.channels.map((channel) => { return channel.id; });
		blacklisted.channels = [...new Set(channels)];

		await DbSet.getInstance().guild.general.update({
			where: {
				id: req.body.guild_id,
			},
			data: {
				blacklisted_channels: blacklisted,
				lang: req.body.lang,
			},
		});

		res.send({ message: 'Configuração salva' });
	}
};