const database = require('../database/mongo');
const fetch = require('node-fetch')

module.exports = class UserController {
    static async getUserKeys(req, res) {
        const user = await database.fetchUser(req.user.id);
        res.send({ keys: user.premium.keys })
    }

    static async setUserBanner(req, res) {
        const user = await database.fetchUser(req.user.id);

        user.background = req.body.banner
        user.save()
        res.send({ sucess: true, message: "Background definido com sucesso" })
    }

    static async GetUserInfos(req, res) {
        const user = await database.fetchUser(req.user.id);

        const body = {
            background: user.background,
            backgrounds: user.backgroundList,
            aboutme: user.aboutme,
            layouts: user.profileList,
            layout: user.profileType,
            color: user.profileColor
        }

        res.send(body)
    }
  }