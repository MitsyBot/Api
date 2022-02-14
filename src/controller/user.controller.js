const database = require('../database/mongo');

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

    static async setUserAboutme(req, res) {
        const user = await database.fetchUser(req.user.id);

        user.aboutme = req.body.aboutme
        user.save()
        res.send({ sucess: true, message: "Aboutme definido com sucesso" })
    }

    static async setUserBadges(req, res) {
        const user = await database.fetchUser(req.user.id);

        user.badgesEnabled = req.body.badges
        user.save()
        res.send({ sucess: true, message: "As badges foram definidas com sucesso" })
    }

    static async GetUserInfos(req, res) {
        const user = await database.fetchUser(req.user.id);

        const body = {
            badges: {
                all: user.badgeList,
                enabled: user.badgesEnabled
            },
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