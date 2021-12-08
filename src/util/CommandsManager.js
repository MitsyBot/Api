module.exports = class CommandsManager {

  constructor() {
    this.commands = new Map();
  }

  getAllCommands() {
    return Array.from(this.commands.values());
  }

  clearCommands() {
    this.commands.clear();
  }

  postCommands(commands) {
    this.clearCommands();
    commands.forEach(a => this.commands.set(a.name, a));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CommandsManager();
    }

    return this.instance;
  }
}