const database = require('../../database/mongo');
const { makeRequest, generateRandomId } = require('../../util/WebSocket')
module.exports = class GuildController {
    static async GetIndexGuildConfig(req, res) {
        const guild = await database.fetchGuild(req.headers['guild']);
        const token = req.headers['Authorization']
        const user = req.headers['User']

        if(!token) return res.status(400).send({ err: true })
        
        const request = await makeRequest('mitsy', 
        {
          id: generateRandomId(),
          type: 'guild',
          data: {
            guildId: guild.id,
            userId: user
          },
        })
        res.status(200).json(request)
        // res.status(200).json({
          //id: guild.id,
          //icon: currentGuild[0].icon,
          //name: currentGuild[0].name,
          //isOwner: currentGuild[0].owner,
          //blacklisted: guild.blacklist,
          //blacklistReason: guild.blacklistReason,
          // Informações usadas
          //isPremium: guild.isPremium,
          //premiumTier: guild.premiumLevel,
          //locale: guild.lang,
          //partner: guild.partner,
        //})
    }
  }