const database = require('../database/mongo');
module.exports = class UserController {
    static async GetGuild(req, res) {
        const guild = await database.fetchUser(req.params.id);
        res.json(guild)
    }
  }