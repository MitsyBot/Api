module.exports = class BackgroundRepository {
	constructor(connection) {
		this.bgs = connection.Background;
	}
};