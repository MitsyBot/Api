const database = require('../database/mongo');
const fetch = require('node-fetch')

module.exports = class UserController {
    static async GetUserBanners(req, res) {
        const user = await database.fetchUser(req.user.id);

        if(user) {
        res.status(200).json(user.backgroundList)
        } else {
            res.status(200).json({ message: 'Usuario não encontrado' })
        }
    }
    static async getUserKeys(req, res) {
        const user = await database.fetchUser(req.user.id);
        res.send({ keys: user.premium.keys })
    }

    static async getUserBanner(req, res) {
        const user = await database.fetchUser(req.user.id);

        if(user) {
        res.status(200).json({ background: user.background })
        } else {
            res.status(200).json({ message: 'Usuario não encontrado' })
        }
    }

    static async setUserBanner(req, res) {
        const user = await database.fetchUser(req.user.id);

        user.background = req.body.banner
        user.save()
    
        res.send({ message: "Background definido com sucesso" })
    }
  }