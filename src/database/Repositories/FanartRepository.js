module.exports = class FanartRepository {
	constructor(connection) {
		this.arts = connection.Fanarts;
	}
};