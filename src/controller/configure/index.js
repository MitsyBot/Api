const database = require('../../database/mongo');
const fetch = require('node-fetch')
module.exports = class GuildController {
    static async GetIndexGuildConfig(req, res) {
        const guild = await database.fetchGuild(req.headers['guild']);
        const userToken = req.body.token || req.headers['authorization']
        const userGuilds = await (await fetch(`http://localhost:${process.env.PORT}/user/guilds`, {
            method: 'GET',
            headers: {
              Authorization: userToken,
              'content-type': 'application/json'
            }
          })).json()
        if (userGuilds.error === 'Unauthorized') return res.status(200).json({ error: "Unauthorized" });
        
        if (userGuilds.message === 'You are being rate limited.') return res.json(userGuilds);

        const currentGuild = userGuilds.filter(guilds => guilds.id === req.headers['guild'])

        if(!currentGuild[0]) return res.status(200).json({error: "You cannot manage this guild"})

        if(guild.message === 'Servidor não encontrado') return res.status(200).json({ message: 'Servidor não encontrado' })

        if (!currentGuild[0].canManage) return res.status(200).json({ error: "Missing permissions" });

        res.status(200).json({
          id: guild.id,
          icon: currentGuild[0].icon,
          name: currentGuild[0].name,
          isOwner: currentGuild[0].owner,
          blacklisted: guild.blacklist,
          blacklistReason: guild.blacklistReason,
          // Informações usadas
          isPremium: guild.isPremium,
          premiumTier: guild.premiumLevel,
          locale: guild.lang,
          partner: guild.partner,
        })
    }
  }