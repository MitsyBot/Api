const mongoose = require('mongoose');
const Backgrounds = new mongoose.Schema({
	author_id: { type: String },
	id: { type: String, index: { unique: true } },
	name: { type: String, default: 'Mitsy fofa' },
    cost: { type: Number, default: '5000' },
    rarity: { type: String, default: 'low' }
});

module.exports = mongoose.model('Backgrounds', Backgrounds);