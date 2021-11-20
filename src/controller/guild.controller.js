const database = require('../database/mongo');
module.exports = class UserController {
    static async GetGuild(req, res) {
        const guild = await database.fetchGuild(req.params.id);
        res.json(guild)
    }
  }