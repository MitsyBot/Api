const mongoose = require('mongoose');

const BlacklistedSchema = new mongoose.Schema({
	reason: { type: String, required: true },
	blacklister: { type: String, required: true },
});

const UserConnection = new mongoose.Schema({
	name: String,
	tokens: Object,
	config: Object,
});

const KeySchema = new mongoose.Schema({
	id: String,
	enabled: Boolean,
	guild: String,
	level: Number
});

const Users = new mongoose.Schema({
	_id: String,
	id: { type: String, index: { unique: true } },
	comets: { type: Number, default: 0, index: true },
	xp: { type: Number, default: 0, index: true },
	level: { type: Number, default: 1, index: true },
	timeDaily: { type: Number, default: 0 },
	afk: { type: Boolean, default: false, index: true },
	afkReason: { type: String, default: null },
	blacklist: { type: Boolean, default: false, index: true },
	aboutme: { type: String, default: 'Mitsy é minha melhor amiga, Você pode mudar esse texto no seu perfil do meu website.' },
	profileColor: { type: String, default: '#f895fb' },
	isMarry: { type: Boolean, default: false },
	marryWith: { type: String, default: '' },
	repCount: { type: Number, default: 0 },
	repTime: { type: Number, default: 0 },
	repLog: { type: Array, default: [] },
	shipValue: { type: String, default: null },
	background: { type: String, default: 'mitsy_1' },
	profileType: { type: String, default: 'default' },
	backgroundList: { type: Array, default: ['mitsy_1'] },
	profileList: { type: Array, default: ['default'] },
	badgeList: { type: Array },
	badgesEnabled: { type: Array },
	colorList: { type: Array, default: ['#f895fb'] },
	isPremium: { type: Boolean, default: false },
	isStaff: { type: Boolean, default: false },
	staffLevel: { type: Number, default: 0 },
	blacklisted: BlacklistedSchema,
	connections: [UserConnection],
	premium: {
		time: { type: Number, default: 0 },
		tier: { type: Number, default: 0 },
		keys: [KeySchema],
	},
});

module.exports = mongoose.model('Users', Users);