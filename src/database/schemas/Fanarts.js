const mongoose = require('mongoose');
const Fanarts = new mongoose.Schema({
	authorid: { type: String },
	id: { type: String, index: { unique: true } },
	name: { type: String, default: 'Mitsy fofa' },
});

module.exports = mongoose.model('Fanarts', Fanarts);