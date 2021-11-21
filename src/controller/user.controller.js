const database = require('../database/mongo');
const fetch = require('node-fetch')

module.exports = class UserController {
    static async GetUser(req, res) {
        const user = await database.fetchUser(req.body.userID);
        if(user.backgroundList) {
        res.json({
          "id": user.id,
          "comets": user.comets,
          "xp": user.xp,
          "level": user.level,
          "timeDaily": user.timeDaily,
          "afk": user.afk,
          "afkReason": user.afkReason,
          "blacklist": user.blacklist,
          "blacklistReason": user.blacklistReason,
          "aboutme": user.aboutme,
          "profileColor": user.profileColor,
          "isMarry": user.isMarry,
          "marryWith": user.marryWith,
          "repCount": user.repCount,
          "repTime": user.repTime,
          "repLog": user.repLog,
          "shipValue": user.shipValue,
          "background": user.background,
          "profileType": user.profileType,
          "backgroundList": user.backgroundList,
          "profileList": user.profileList,
          "isPremium": user.isPremium,
          "premiumLevel": user.premiumLevel,
          "isStaff": user.isStaff,
          "staffLevel": user.staffLevel,
        })
        } else {
            res.json({ message: 'Usuario não encontrado'})
        }
    }

    static async GetUserGuild(req, res) {
    const userToken = req.body.userToken

    const userGuilds = await (await fetch(`https://discord.com/api/users/@me/guilds`, {
            method: 'GET',
            headers: {
              Authorization: userToken,
              'content-type': 'application/json'
            }
          })).json()
        
        if (userGuilds.message === '401: Unauthorized') return res.json({ error: "Unauthorized" });

        const parentGuild = await Promise.all(userGuilds.map(async (guilds) => { 
          const dbGuilds = await database.fetchGuild(guilds.id);
          console.log(dbGuilds)
          guilds.parent = Boolean(dbGuilds.id)
          guilds.canManage = Boolean(guilds.permissions & 0x0000000020)
          return guilds
        }))

        res.json(parentGuild)
    }

    static async GetUserBanners(req, res) {
        const user = await database.fetchUser(req.body.userID);

        if(user.backgroundList) {

        res.json(user.backgroundList)
        } else {
            res.json({ message: 'Usuario não encontrado' })
        }
    }
  }