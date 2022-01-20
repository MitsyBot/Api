const database = require('../database/mongo');
const fetch = require('node-fetch')

module.exports = class UserController {
    static async GetUserBanners(req, res) {
        const user = await database.fetchUser(req.body.userID);

        if(user.backgroundList) {

        res.status(200).json(user.backgroundList)
        } else {
            res.status(200).json({ message: 'Usuario não encontrado' })
        }
    }
  }