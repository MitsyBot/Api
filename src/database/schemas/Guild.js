const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
	active: { type: Boolean, required: true },
	values: {},
});

const Guilds = new mongoose.Schema({
	_id: String,
	id: { type: String, index: { unique: true } },
	prefix: { type: String, default: process.env.BOT_PREFIX },
	lang: { type: String, default: 'pt-BR' },
	modules: {
		type: Map,
		of: ModuleSchema,
	},
	partner: { type: Boolean, default: false },
	logChannel: { type: String, default: '' },
	customCommands: { type: Array },
	blacklist: { type: Boolean, default: false },
	blacklistReason: { type: String, default: '' },
	isPremium: { type: Boolean, default: false },
	blacklistedChannels: { type: Object, default: { channels: [], warn: false }	},
	premiumLevel: { type: Number, default: 0 },
});

module.exports = mongoose.model('Guilds', Guilds);