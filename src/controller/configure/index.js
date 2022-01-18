const database = require('../../database/mongo');
const { makeRequest, generateRandomId } = require('../../util/WebSocket')
module.exports = class GuildController {
    static async GetIndexGuildConfig(req, res) {
          const { user, guild } = req.params;

        const dbGuild = await database.fetchGuild(guild);
        const request = await makeRequest('mitsy', 
        {
          id: generateRandomId(),
          type: 'guild',
          data: {
            guildId: dbGuild.id,
            userId: user
          },
        })

        request.data.blacklisted = dbGuild.blacklist
        request.data.blacklistReason = gudbGuildild.blacklistReason
        request.data.isPremium = dbGuild.isPremium,
        request.data.premiumTier = dbGuild.premiumLevel,
        request.data.locale = dbGuild.lang,
        request.data.partner = dbGuild.partner,

        res.send(request.data)
      }
    }