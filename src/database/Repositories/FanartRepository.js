module.exports = class UserRepository {
	constructor(connection) {
		this.arts = connection.Fanarts;
	}
};