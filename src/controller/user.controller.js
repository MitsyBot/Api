const database = require('../database/mongo');
module.exports = class UserController {
    static async GetUser(req, res) {
        const user = await database.fetchUser(req.params.id);
        res.json(user)
    }

    static async GetUserBanners(req, res) {
        const user = await database.fetchUser(req.params.id);

        if(user.backgroundList) {

        res.json(user.backgroundList)
        } else {
            res.json({ message: 'Usuario não encontrado' })
        }
    }
  }