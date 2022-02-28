module.exports = class ColorRepository {
	constructor(connection) {
		this.repo = connection.Colors;
	}
};