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
					guildId: guild.general.id,
					userId: req.user.id,
				},
			});

		request.data.blacklist = blacklist;
		request.data.roles = request.data.roles.filter((role) => {
			return !role.name.includes('@everyone');
		});
		/* request.data.isPremium = guild.isPremium,
		request.data.premiumTier = guild.premiumLevel, */
		request.data.premium = {
			isPremium: Boolean(guild.key),
			tier: guild.key.tier || 0,
		};
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
		request.data.starboard = {
			enabled: guild.starboard.enabled,
			starboard_channel: guild.starboard.starboard_channel,
			required_stars: guild.starboard.required_stars,
			emoji: guild.starboard.emoji,
		};
		request.data.autorole = {
			enabled: guild.autorole.enabled,
			roles: guild.autorole.roles,
			give_after: guild.autorole.give_after,
			give_after_message: guild.autorole.give_after_message,
		};
		request.data.welcomer = {
			enabled: guild.welcomer.enabled,
			tell_on_join: guild.welcomer.tell_on_join,
			channel_join: guild.welcomer.channel_join,
			join_message: guild.welcomer.join_message,
			delete_join_messages_after: guild.welcomer.delete_join_messages_after,
			tell_on_remove: guild.welcomer.tell_on_remove,
			channel_remove: guild.welcomer.channel_remove,
			remove_message: guild.welcomer.remove_message,
			delete_remove_messages_after: guild.welcomer.delete_remove_messages_after,
			tell_on_private_join: guild.welcomer.tell_on_private_join,
			join_private_message: guild.welcomer.join_private_message,
		};
		res.send(request.data);
	}
	static async SetIndexGuildConfig(req, res) {
		const blacklisted = req.body.blacklisted;
		const channels = blacklisted.channels.map((channel) => { return channel.id; });
		blacklisted.channels = [...new Set(channels)];

		if (blacklisted.warnMessage.embed) {
			blacklisted.warnMessage.embeds = [blacklisted.warnMessage.embed];
		}
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

	static async SetAutoroleConfig(req, res) {
		const new_roles = req.body.roles.map((role) => { return role.id; });
		req.body.roles = [...new Set(new_roles)];
		if (req.body.give_after < 0) req.body.give_after = 0;

		const {
			enabled,
			roles,
			give_after,
			give_after_message,
		} = req.body;

		await DbSet.getInstance().guild.autorole.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				roles,
				give_after,
				give_after_message,
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

		if (message.embed) {
			message.embeds = [message.embed];
			delete message.embed;
		}
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

	static async setStarboardConfig(req, res) {
		const {
			enabled,
			starboard_channel,
			required_stars,
		} = req.body;

		await DbSet.getInstance().guild.starboard.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				starboard_channel,
				required_stars,
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

		if (warn_message.embed) {
			warn_message.embeds = [warn_message.embed];
			delete warn_message.embed;
		}
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

	static async setWelcomerConfig(req, res) {
		const {
			enabled,
			tell_on_join,
			channel_join,
			join_message,
			tell_on_remove,
			channel_remove,
			remove_message,
			tell_on_private_join,
			join_private_message,
		} = req.body;


		let {
			delete_join_messages_after,
			delete_remove_messages_after,
		} = req.body;

		if (join_message.embed) {
			join_message.embeds = [join_message.embed];
			delete join_message.embed;
		}

		if (remove_message.embed) {
			remove_message.embeds = [remove_message.embed];
			delete remove_message.embed;
		}

		if (join_private_message.embed) {
			join_private_message.embeds = [join_private_message.embed];
			delete join_private_message.embed;
		}

		if (delete_remove_messages_after < 0) delete_remove_messages_after = 0;

		if (delete_join_messages_after < 0) delete_join_messages_after = 0;

		await DbSet.getInstance().guild.welcomer.update({
			where: {
				id: req.params.id,
			},
			data: {
				enabled,
				tell_on_join,
				channel_join,
				join_message,
				delete_join_messages_after,
				tell_on_remove,
				channel_remove,
				remove_message,
				delete_remove_messages_after,
				tell_on_private_join,
				join_private_message,
			},
		});
		res.send({ sucess: true, message: 'Configuração salva com sucesso' });
	}
};