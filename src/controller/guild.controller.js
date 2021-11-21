const database = require('../database/mongo');
const fetch = require('node-fetch')
module.exports = class GuildController {
    static async GetGuild(req, res) {
        const guild = await database.fetchGuild(req.body.guildID);
        const userToken = req.body.userToken
        const userGuilds = await (await fetch(`https://discord.com/api/users/@me/guilds`, {
            method: 'GET',
            headers: {
              Authorization: userToken,
              'content-type': 'application/json'
            }
          })).json()
        
        if (userGuilds.message === '401: Unauthorized') return res.json({ error: "Unauthorized" });

        const currentGuild = userGuilds.filter(guilds => guilds.id === req.body.guildID)
        var canManage = false
        
        if (await currentGuild[0].permissions & 0x0000000020) {
            canManage =  true
        }
        
        if (!canManage) return res.json({ error: "Missing permissions" });

        res.json({
          id: guild.id,
          avatar: currentGuild[0].avatar,
          name: currentGuild[0].name,
          reportChannel: guild.channelReport,
          reportEnabled: guild.reportModule,
          ownerId: currentGuild[0].owner,
          locale: guild.lang,
          punishChannel: guild.punishChannel,
          punishEnabled: guild.punishModule,
          partner: guild.partner,
          logChannel: guild.logChannel,
          blacklisted: guild.blacklist,
          blacklistReason: guild.blacklistReason,
          isPremium: guild.isPremium,
          premiumTier: guild.premiumLevel,
          antiflood: guild.antiflood,
          allowedChannel: guild.allowedChannel,
          customCommands: guild.customCommands
        })
    }
  }