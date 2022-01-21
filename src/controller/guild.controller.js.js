const database = require('../../database/mongo');
const { makeRequest, generateRandomId } = require('../../util/WebSocket')
module.exports = class GuildController {
    static async GetIndexGuildConfig(req, res) {
      const guild = await database.fetchGuild(req.headers['guild']);
      const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'guild',
        data: {
          guildId: guild.id,
          userId: req.user.id
        },
      })

      request.data.blacklisted = guild.blacklist
      request.data.blacklistReason = guild.blacklistReason
      request.data.isPremium = guild.isPremium,
      request.data.premiumTier = guild.premiumLevel,
      request.data.locale = guild.lang,
      request.data.partner = guild.partner,

      res.send(request.data)
      }
    }