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
    commands.data.commands.forEach(a => this.commands.set(a.name, a));
  }

  editMaintenance(commandName, disabled) {
    const existingData = this.commands.get(commandName);
    existingData.disabled = disabled;
    this.commands.set(commandName, existingData);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CommandsManager();
    }

    return this.instance;
  }
}
