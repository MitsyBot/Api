const database = require('../database/mongo');
const { makeRequest, generateRandomId } = require('../util/WebSocket')
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
      request.data.blacklistedChannels = guild.blacklistedChannels
      res.send(request.data)
      }
      static async SetIndexGuildConfig(req, res) {
        const guild = await database.fetchGuild(req.body.guildid);

        let blacklisted = req.body.blacklisted
        blacklisted.channels = blacklisted.channels.map((channel) => { return channel.id })

        guild.blacklistedChannels = blacklisted
        guild.lang = req.body.lang
        guild.save()

        console.log(req.body)
        res.send({ message: 'Configuração salva' })
      }
    }