const db = require('../database/mongo')

async function getUserBadges (req) { 
    const badgesFromGuilds = await db.getGuildBadges()
    const userGuilds = req.guilds
    const user = await db.fetchUser(req.user.id)

    userGuilds.map((guild) => {
        Promisse.all(badgesFromGuilds.map(async (badge) => {
            if(badge.id === guild.id) {
                const dbGuild = await db.fetchGuild(guild.id)
                if(dbGuild.isPremium) {
                user.badgeList.push(badge.id)
                }
            }
        }))
    }) 

    console.log(user.badgeList)

    return { allBadges: user.badgeList, badgesEnabled: user.badgesEnabled }
}

module.exports = { getUserBadges }