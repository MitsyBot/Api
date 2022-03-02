module.exports = class ColorRepository {
	constructor(connection) {
		this.table = connection.Colors;
	}
};