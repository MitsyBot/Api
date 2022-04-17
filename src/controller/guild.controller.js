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
					guildId: guild.general.guildId,
					userId: req.user.id,
				},
			});

		request.data.blacklist = blacklist;
		/* request.data.isPremium = guild.isPremium,
		request.data.premiumTier = guild.premiumLevel, */
		request.data.locale = guild.general.lang,
		request.data.blacklistedChannels = {
			channels: guild.general.blacklisted_channels,
			warn: guild.general.custom_warn_message,
			message: guild.general.blacklisted_warning,
		};
		request.data.eventLog = {
			enabled: guild.event_log.enabled,
			event_log_channel: guild.event_log.event_log_channel,
			ignore_bots: guild.event_log.ignore_bots,
			member_banned: guild.event_log.member_banned,
			member_unbanned: guild.event_log.member_unbanned,
			message_edited: guild.event_log.message_edited,
			message_deleted: guild.event_log.message_deleted,
			nickname_changes: guild.event_log.nickname_changes,
			voice_channel_joins: guild.event_log.voice_channel_joins,
			voice_channel_leaves: guild.event_log.voice_channel_leaves,
			avatar_changes: guild.event_log.avatar_changes,
		};
		request.data.birthday = {
			enabled: guild.birthday.enabled,
			channel: guild.birthday.channel,
			message: guild.birthday.message,
		};
		request.data.inviteblock = {
			enabled: guild.invite_blocker.enabled,
			whitelisted_channels: guild.invite_blocker.whitelisted_channels,
			whitelist_server_invites: guild.invite_blocker.whitelist_server_invites,
			delete_message: guild.invite_blocker.delete_message,
			tell_user: guild.invite_blocker.tell_user,
			warn_message: guild.invite_blocker.warn_message,
		};
		res.send(request.data);
	}
	static async SetIndexGuildConfig(req, res) {
		const blacklisted = req.body.blacklisted;
		const channels = blacklisted.channels.map((channel) => { return channel.id; });
		blacklisted.channels = [...new Set(channels)];

		blacklisted.warnMessage.embeds = [blacklisted.warnMessage.embed];
		delete blacklisted.warnMessage.embed;

		await DbSet.getInstance().guild.general.update({
			where: {
				id: req.body.guild_id,
			},
			data: {
				blacklisted_channels: blacklisted.channels,
				custom_warn_message: blacklisted.warn,
				blacklisted_warning: blacklisted.warnMessage,
				lang: req.body.lang,
			},
		});

		res.send({ message: 'Configuração salva' });
	}

	static async setEventLogConfig(req, res) {
		const {
			enabled,
			event_log_channel,
			ignore_bots,
			member_banned,
			member_unbanned,
			message_edited,
			message_deleted,
			nickname_changes,
			voice_channel_joins,
			voice_channel_leaves,
			avatar_changes,
		} = req.body;
		await DbSet.getInstance().guild.event_log.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				event_log_channel,
				ignore_bots,
				member_banned,
				member_unbanned,
				message_edited,
				message_deleted,
				nickname_changes,
				voice_channel_joins,
				voice_channel_leaves,
				avatar_changes,
			},
		});
		res.send({ sucess: true, message: 'Configuração salva com sucesso' });
	}

	static async setBirthdayConfig(req, res) {
		const {
			enabled,
			channel,
			message,
		} = req.body;
		message.embeds = [message.embed];
		delete message.embed;
		await DbSet.getInstance().guild.birthday.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				channel,
				message,
			},
		});
		res.send({ sucess: true, message: 'Configuração salva com sucesso' });
	}


	static async setInviteBlockerConfig(req, res) {
		const {
			enabled,
			whitelist_server_invites,
			delete_message,
			tell_user,
			warn_message,
		} = req.body;
		warn_message.embeds = [warn_message.embed];
		delete warn_message.embed;

		let { whitelisted_channels } = req.body;
		whitelisted_channels = whitelisted_channels.map((channel) => { return channel.id; });

		await DbSet.getInstance().guild.invite_blocker.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				whitelisted_channels,
				whitelist_server_invites,
				delete_message,
				tell_user,
				warn_message,
			},
		});
		res.send({ sucess: true, message: 'Configuração salva com sucesso' });
	}
};