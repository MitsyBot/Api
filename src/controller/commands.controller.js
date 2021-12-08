const CommandsManager = require('../util/CommandsManager');

module.exports = class CommandsController {
  static async getCommands(_req, res) {
    const commands = CommandsManager.getInstance().getAllCommands();

    return res.status(200).json(commands);
  }

  static createCommands(req, res) {
    const commands = req.body.data;
    if (!commands) return res.sendStatus(400);
    CommandsManager.getInstance().postCommands(commands);

    return res.sendStatus(200);
  }

}
