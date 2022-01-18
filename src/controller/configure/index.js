const database = require('../../database/mongo');
const { makeRequest, generateRandomId } = require('../../util/WebSocket')
module.exports = class GuildController {
    static async GetIndexGuildConfig(req, res) {
        const guild = await database.fetchGuild(req.headers['guild']);
        const user = req.headers['user']
        const request = await makeRequest('mitsy', 
        {
          id: generateRandomId(),
          type: 'guild',
          data: {
            guildId: guild.id,
            userId: user
          },
        })

        request.blacklisted = guild.blacklist
        request.blacklistReason = guild.blacklistReason
        request.isPremium = guild.isPremium,
        request.premiumTier = guild.premiumLevel,
        request.locale = guild.lang,
        request.partner = guild.partner,

        res.status(200).json(request)
    }
  }