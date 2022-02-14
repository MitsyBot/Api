const mongoose = require('mongoose');
const GuildBadges = new mongoose.Schema({
	id: { type: String, index: { unique: true } },
});

module.exports = mongoose.model('GuildBadges', GuildBadges);